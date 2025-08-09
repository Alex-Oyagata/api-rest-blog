
const { db } = require('../config/conection-db')


// Insertar comentario de una publicación
const createComentario = async (req, res) => {
    const { pub_id, aut_id, com_descripcion } = req.query;

    // Validación básica
    if (!pub_id || !aut_id || !com_descripcion) {
        return res.json({
            message: 'Faltan datos: asegúrate de enviar pub_id, aut_id y com_descripcion.'
        });
    }

    try {
        const result = await db.one(
            'INSERT INTO comentario (pub_id, aut_id, com_descripcion) VALUES ($1, $2, $3) RETURNING *',
            [pub_id, aut_id, com_descripcion]
        );

        res.json({
            message: 'Comentario insertado correctamente',
            body: {
                comentario: result
            }
        });
    } catch (error) {
        console.error('Error al insertar comentario:', error);
        res.json({
            message: 'Error al insertar comentario',
            error: error
        });
    }
};


const editComentario = async (req, res) => {
    const { ByID } = req.params;
    const { com_descripcion } = req.query;

    if (!ByID || !com_descripcion) {
        return res.json({
            message: 'Faltan datos: asegúrate de enviar ByID y com_descripcion.'
        });
    }

    try {
        const result = await db.one(
            'UPDATE comentario SET com_descripcion = $1 WHERE com_id = $2 RETURNING *',
            [com_descripcion, ByID]
        );

        res.json({
            message: 'Comentario actualizado correctamente',
            body: {
                comentario: result
            }
        });
    } catch (error) {
        console.error('Error al actualizar comentario:', error);
        res.json({
            message: 'Error al actualizar comentario',
            error: error
        });
    }
};

//get comentarios
const getComentarios = async (req, res) => {
    try {
        const comentarios = await db.any('SELECT * FROM comentario');
        res.status(200).json(comentarios);
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        res.status(500).json({ error: 'Error al obtener comentarios' });
    }
};

const deleteComentario = async (req, res) => {
    const { ByID } = req.params;

    if (!ByID) {
        return res.json({
            message: 'Falta el ID del comentario a eliminar.'
        });
    }

    try {
        // Eliminar primero las reacciones del comentario
        await db.none('DELETE FROM reaccion WHERE com_id = $1', [ByID]);

        // Luego eliminar el comentario
        await db.none('DELETE FROM comentario WHERE com_id = $1', [ByID]);

        res.json({
            message: 'Comentario y sus reacciones eliminados correctamente',
            body: {
                comentarioId: ByID
            }   
        });
    } catch (error) {
        console.error('Error al eliminar comentario:', error);
        res.json({
            message: 'Error al eliminar comentario',
            error: error
        });
    }
};


module.exports = {
    createComentario,
    getComentarios,
    editComentario,
    deleteComentario
};




    
