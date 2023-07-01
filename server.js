const express = require('express');
const { getJoyas, getJoyasFiltros } = require('./consultas');

const app = express();
const port = 3000;

app.use(express.json());

// Middleware reporte
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/joyas', async (req, res) => {
    try {
        const limits = parseInt(req.query.limits) || 10;
        const page = parseInt(req.query.page) || 1;
        const orderBy = req.query.order_by || 'id_ASC';

        const joyas = await getJoyas(limits, page, orderBy);

        // Calcula el total de joyas y el stock total
        const totalJoyas = joyas.length;
        const stockTotal = joyas.reduce((total, joya) => total + joya.stock, 0);

        // HATEOAS
        const results = joyas.map(joya => ({
            name: joya.nombre,
            href: `/joyas/joya/${joya.id}`
        }));

        res.json({ totalJoyas, stockTotal, results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.get('/joyas/filtros', async (req, res) => {
    try {
        const precioMin = parseInt(req.query.precio_min) || 0;
        const precioMax = parseInt(req.query.precio_max) || 100000;
        const categoria = req.query.categoria || '';
        const metal = req.query.metal || '';

        const joyas = await getJoyasFiltros(precioMin, precioMax, categoria, metal);

        res.json(joyas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.listen(port, () => {
    console.log(`Server ejecutandose en puerto ${port}`);
});
