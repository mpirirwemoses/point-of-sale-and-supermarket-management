const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

// Get all products
router.get('/', authenticateJWT, async (req, res) => {
    const products = await Product.findAll();
    res.json(products);
});

// Get product by id
router.get('/:id', authenticateJWT, async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.sendStatus(404);
    res.json(product);
});

// Create product
router.post('/', authenticateJWT, async (req, res) => {
    const { name, description, price, stock } = req.body;
    const product = await Product.create({ name, description, price, stock });
    res.status(201).json(product);
});

// Update product
router.put('/:id', authenticateJWT, async (req, res) => {
    const { name, description, price, stock } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.sendStatus(404);
    await product.update({ name, description, price, stock });
    res.json(product);
});

// Delete product
router.delete('/:id', authenticateJWT, async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.sendStatus(404);
    await product.destroy();
    res.sendStatus(204);
});

module.exports = router; 