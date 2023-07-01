const { Pool } = require('pg');
const format = require('pg-format');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '123',
    database: 'joyas',
    port: 5432,
    allowExitOnIdle: true,
});

// joyas con pagina y ordenamiento
const getJoyas = async (limits, page, orderBy) => {
    const offset = (page - 1) * limits;
    const order = orderBy.split('_');
    const orderField = order[0];
    const orderDirection = order[1] === 'DESC' ? 'DESC' : 'ASC';

    const query = format(`
            SELECT * FROM inventario
            ORDER BY %I %s
            LIMIT %L
            OFFSET %L
        `, orderField, orderDirection, limits, offset);

    const { rows } = await pool.query(query);

    return rows;
};

// joyas filtradas por precio, categoría y metal
const getJoyasFiltros = async (precioMin, precioMax, categoria, metal) => {
    const query = format(`
            SELECT * FROM inventario
            WHERE precio >= %L
            AND precio <= %L
            AND categoria = %L
            AND metal = %L
        `, precioMin, precioMax, categoria, metal);

    const { rows } = await pool.query(query);

    return rows;
};

module.exports = { getJoyas, getJoyasFiltros };
