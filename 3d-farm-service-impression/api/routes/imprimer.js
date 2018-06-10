const router = express.Router();

/**
 * Vérifier si idPersonnel correspond à un vrai compte
 * @param {*} req la requête
 * @throws error if validation fails
 */
function verifierPersonnel(req) {
    return new Promise.resolve(req);
}

/**
 * Vérifier si le compte a assez de cash
 * @param {*} req 
 */
function verifierCompte(req) {
    return new Promise.resolve(req);
}

/**
 * Vérifier si objet conforme l'imprimante
 * @param {*} req 
 */
function verfierObjet(req) {
    return new Promise.resolve(req);
}

/**
 * Vérifier en général la commande
 * @param {*} req 
 */
function verifier(req) {
    return verifierPersonnel(req)
    .then(verifierCompte)
    .then(verfierObjet);
}

/**
 * Faire s'abonnere le personnel à cette commande
 * @param {*} req 
 */
function abonnerPersonnelACommande(req) {
    return new Promise.resolve(req);
}

/**
 * Lancer un nouveau thread d'impression
 * @param {*} req 
 */
function lancerImpression(req) {
    return new Promise.resolve(req);
}

// Imprimer une commande
router.post("/", (req, res) => {
    verifier(req)
    .then(abonnerPersonnelACommande)
    .then(lancerImpression)
    .catch(err => {
        console.error(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;