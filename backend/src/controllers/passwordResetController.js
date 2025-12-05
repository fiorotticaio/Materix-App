import crypto from "crypto";
import bcrypt from "bcrypt";
import pool from "../config/db.js";
import transporter from "../config/nodemailer.js";

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Verifica se o usuário existe
    const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userQuery.rows.length === 0) {
      return res.status(200).json({ message: "Se o e-mail existir, enviaremos instruções." }); 
      // Segurança: nunca revelar se existe ou não
    }

    const user = userQuery.rows[0];

    // 2. Gera token único
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutos

    // 3. Salva token no banco
    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, token, expiresAt]
    );

    // 4. Gera link
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    // 5. Envia o e-mail
    await transporter.sendMail({
      from: "no-reply@materix.com",
      to: email,
      subject: "Recuperação de senha",
      html: `
        <h3>Recuperação de senha</h3>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Esse link expira em 15 minutos.</p>
      `
    });

    return res.json({ message: "Email enviado" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao solicitar recuperação" });
  }
};


export const validateResetToken = async (req, res) => {
  const { token } = req.params;

  try {
    const tokenQuery = await pool.query(
      `SELECT * FROM password_reset_tokens 
       WHERE token = $1 AND used = FALSE AND expires_at > NOW()`,
      [token]
    );

    if (tokenQuery.rows.length === 0) {
      return res.status(400).json({ valid: false });
    }

    return res.json({ valid: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao verificar token" });
  }
};


export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // 1. Checa token
    const tokenQuery = await pool.query(
      `SELECT * FROM password_reset_tokens 
       WHERE token = $1 AND used = FALSE AND expires_at > NOW()`,
      [token]
    );
    
    if (tokenQuery.rows.length === 0) {
      return res.status(400).json({ error: "Token inválido ou expirado" });
    }

    const resetData = tokenQuery.rows[0];

    // 2. Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Atualiza senha
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      hashedPassword,
      resetData.user_id
    ]);

    // 4. Marca token como usado
    await pool.query(
      "UPDATE password_reset_tokens SET used = TRUE WHERE id = $1",
      [resetData.id]
    );

    return res.json({ message: "Senha redefinida com sucesso" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao redefinir senha" });
  }
};