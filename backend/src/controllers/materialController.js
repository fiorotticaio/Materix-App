import { resolveDetectedMaterials, getNonBaseItems } from "../services/materialService.js";


export const resolveMaterials = async(req, res) => {
    try {
        const { detected } = req.body;

        if (!Array.isArray(detected) || detected.length === 0) {
        return res.status(400).json({ error: "Campo 'detected' é obrigatório." });
        }

        const result = await resolveDetectedMaterials(detected);

        res.json(result);

    } catch (err) {
        console.error("Erro no resolveMaterials:", err);
        res.status(500).json({ error: "Erro interno ao processar materiais." });
    }
}

export const getMaterials = async (req, res) => {
    try {
        const result = await getNonBaseItems();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};