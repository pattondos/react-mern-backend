const { response, request } = require('express');
const  Evento = require('../models/Evento')

const crearEvento = async(req = request, res = response) => {

    const evento = new Evento( req.body);

    try {
        evento.user = req.uid;

        const newEvent = await evento.save();

        res.status(200).json({
            ok: true,
            msg: 'Evento creado en el calendario.',
            evento: newEvent,
        });
        console.log('Eventro creado en el calendario.')
        
    } catch (error) {

        console.error('Error al crear nuevo evento: '+error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error inesperado, por favor contacte un administrador.'
        });
    }
};

const actualizarEvento = async(req = request, res = response) => {  
    const eventoId = req.params.id
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId);

        if(!evento){
            console.error('Error al encontrar evento: '+error);
            return res.status(404).json({
                ok: false,
                msg: 'Evento del calendario inexistente, por favor verifique sus datos.'
            });
        }

        if( evento.user.toString() !== uid ){
            console.error('Error al actualizar evento: '+error);

            return res.status(401).json({
                ok: false,
                msg: 'el usuario no tiene permiso para editar este evento.'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const updEvento = await Evento.findByIdAndUpdate( eventoId, nuevoEvento,{
            new: true
        } );

        res.status(200).json({
            ok: true,
            msg: 'Evento del calendario actualizado correctamente.',
            evento: updEvento,
        });
        
    } catch (error) {

        console.error('Error al actualizar el evento: '+error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error inesperado, por favor contacte un administrador.'
        });
    }
    
};

const eliminarEvento = async(req = request, res = response) => {

    const eventoId = req.params.id
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId);

        if(!evento){
            console.error('Error al encontrar evento: '+error);
            return res.status(404).json({
                ok: false,
                msg: 'Evento del calendario inexistente, por favor verifique sus datos.'
            });
        }

        if( evento.user.toString() !== uid ){
            console.error('Error al eliminar evento: '+error);
            return res.status(401).json({
                ok: false,
                msg: 'El usuario no tiene permiso para eliminar este evento.'
            });
        }

        await Evento.findByIdAndDelete( eventoId );

        res.status(200).json({
            ok: true,
            msg: 'Evento eliminado correctamente del calendario.',
        });
        
    } catch (error) {

        console.error('Error al eliminar el evento: '+error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error inesperado, por favor contacte un administrador.'
        });
    }
};

const obtenerEventos = async(req = request, res = response) => {
    const eventos = await Evento.find().populate('user', 'name');

    res.status(200).json({
        ok: true,
        msg: 'Listado de eventos.',
        eventos,
    });
};

module.exports = {
    actualizarEvento,
    crearEvento,
    eliminarEvento,
    obtenerEventos,
}