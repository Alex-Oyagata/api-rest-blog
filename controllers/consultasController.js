const { db } = require('../config/conection-db')


const getPublicacionesConComentarios = async (req, res) => {
    try {
        const publicaciones = await db.any(`
            SELECT 
                p.pub_id AS codigo_publicacion,
                p.pub_titulo AS titulo_publicacion,
                a.aut_usuario AS usuario_comentario,
                c.com_descripcion AS comentario
            FROM 
                publicacion p
            JOIN 
                comentario c ON p.pub_id = c.pub_id
            JOIN 
                autor a ON c.aut_id = a.aut_id
        `);
        res.status(200).json(publicaciones);
    } catch (error) {
        console.error('Error al obtener publicaciones con comentarios:', error);
        res.status(500).json({ error: 'Error al obtener publicaciones con comentarios' });
    }
};


const getAutoresYPublicaciones = async (req, res) => {
    try {
        const autoresPublicaciones = await db.any(`
            SELECT 
                a.aut_usuario AS usuario,
                a.aut_nombre AS nombre,
                p.pub_titulo AS titulo_publicacion,
                p.pub_descripcion AS descripcion_publicacion
            FROM 
                autor a
            JOIN 
                publicacion p ON a.aut_id = p.aut_id
        `);
        res.status(200).json(autoresPublicaciones);
    } catch (error) {
        console.error('Error al obtener autores y publicaciones:', error);
        res.status(500).json({ error: 'Error al obtener autores y publicaciones' });
    }
};


const getComentariosPorPublicacion = async (req, res) => {
    const { ByID } = req.params;

    if (!ByID) {
        return res.status(400).json({
            message: 'Falta el parámetro ByID para obtener los comentarios de la publicación.'
        });
    }

    try {
        const comentarios = await db.any(`
            SELECT 
                p.pub_id AS codigo_publicacion,
                p.pub_titulo AS titulo_publicacion,
                a.aut_usuario AS usuario_comentario,
                c.com_descripcion AS comentario
            FROM 
                publicacion p
            JOIN 
                comentario c ON p.pub_id = c.pub_id
            JOIN 
                autor a ON c.aut_id = a.aut_id
            WHERE 
                p.pub_id = $1
        `, [ByID]);
        if (comentarios.length === 0) {
            return res.status(404).json({
                message: 'No se encontraron comentarios para la publicación con el ID proporcionado.'
            });
        }
        res.status(200).json(comentarios);
    }
    catch (error) {
        console.error('Error al obtener comentarios por publicación:', error);
        res.status(500).json({ error: 'Error al obtener comentarios por publicación' });
    }
};

const getPublicacionesConNumeroComentarios = async (req, res) => {
    try {
        const publicaciones = await db.any(`
            SELECT 
                p.pub_titulo AS titulo_publicacion,
                COUNT(c.com_id) AS numero_comentarios
            FROM 
                publicacion p
            LEFT JOIN 
                comentario c ON p.pub_id = c.pub_id
            GROUP BY 
                p.pub_titulo
            ORDER BY 
                numero_comentarios DESC
        `);

        res.status(200).json(publicaciones);
    } catch (error) {
        console.error('Error al obtener publicaciones con número de comentarios:', error);
        res.status(500).json({ error: 'Error al obtener publicaciones con número de comentarios' });
    }
};

const getPublicacionComentariosLikes = async (req, res) => {
    const { ByID } = req.params;

    if (!ByID) {
        return res.status(400).json({
            message: 'Falta el parámetro ByID para obtener los comentarios y likes.'
        });
    }

    try {
        const resultados = await db.any(`
            SELECT 
                p.pub_titulo AS titulo_publicacion,
                c.com_descripcion AS comentario,
                COUNT(r.rea_id) AS numero_likes
            FROM 
                publicacion p
            JOIN 
                comentario c ON p.pub_id = c.pub_id
            LEFT JOIN 
                reaccion r ON c.com_id = r.com_id
            WHERE 
                p.pub_id = $1
            GROUP BY 
                p.pub_titulo, c.com_id, c.com_descripcion
            ORDER BY 
                numero_likes DESC
        `, [ByID]);

        res.status(200).json(resultados);
    } catch (error) {
        console.error('Error al obtener datos de publicación:', error);
        res.status(500).json({ error: 'Error al obtener comentarios y likes de la publicación' });
    }
};

const getCategoriasPublicacionesComentarios = async (req, res) => {
    try {
        const resultados = await db.any(`
            SELECT 
                cat.cat_titulo AS categoria,
                p.pub_titulo AS titulo_publicacion,
                c.com_descripcion AS comentario,
                COUNT(DISTINCT r.rea_id) AS numero_likes,
                COUNT(DISTINCT a.aut_id) AS numero_autores_comentario
            FROM 
                categoria cat
            JOIN 
                publicacion p ON cat.cat_id = p.cat_id
            JOIN 
                comentario c ON p.pub_id = c.pub_id
            LEFT JOIN 
                reaccion r ON c.com_id = r.com_id
            JOIN 
                autor a ON c.aut_id = a.aut_id
            GROUP BY 
                cat.cat_titulo, p.pub_titulo, c.com_id, c.com_descripcion
            ORDER BY 
                numero_likes DESC;
        `);

        res.status(200).json(resultados);
    } catch (error) {
        console.error('Error al obtener datos completos:', error);
        res.status(500).json({ error: 'Error al obtener categorías, publicaciones y comentarios' });
    }
};

const getAutoresCategoriasPublicacionesLikes = async (req, res) => {
    try {
        const resultados = await db.any(`
            SELECT
                au.aut_nombre AS nombre_autor,
                ca.cat_titulo AS categoria,
                COUNT(DISTINCT pu.pub_id) AS numero_publicaciones,
                COUNT(DISTINCT re.rea_id) AS numero_likes
            FROM
                autor au
            JOIN
                publicacion pu ON au.aut_id = pu.aut_id
            JOIN
                categoria ca ON pu.cat_id = ca.cat_id
            LEFT JOIN
                comentario co ON pu.pub_id = co.pub_id
            LEFT JOIN
                reaccion re ON co.com_id = re.com_id
            GROUP BY
                au.aut_nombre,
                ca.cat_titulo
            ORDER BY
                numero_likes DESC,
                numero_publicaciones DESC;
        `);

        res.status(200).json(resultados);
    } catch (error) {
        console.error('Error al obtener autores, categorías, publicaciones y likes:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
};








module.exports = {
    getPublicacionesConComentarios,
    getAutoresYPublicaciones,
    getComentariosPorPublicacion,
    getPublicacionesConNumeroComentarios,
    getPublicacionComentariosLikes,
    getCategoriasPublicacionesComentarios,
    getAutoresCategoriasPublicacionesLikes
};
