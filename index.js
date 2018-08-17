const express = require ('express')
const bodyParser = require('body-parser')
const { checkSchema, validationResult } = require ('express-validator/check')
const server = express()
const porta = 3000

const USUARIOS = [
    {id:1, nome:'Douglas', profissao:'Professor'},
    {id:2, nome:'José', profissao:'Analista'},
    {id:3, nome:'João', profissao:'Programador'},
    {id:4, nome:'Paulo', profissao:'Pedreiro'}
]

// server.use(bodyParser.json())
// server.use(bodyParser.urlencoded({ extended: false }))

server.use(express.json())
server.use(express.urlencoded({ extended: false }))

server.use((request, response, next) => {

    const {token} = request.query;

    if(token === '123'){
        next()
    }else{
        response.status(403).send('usuario inválido')
    }
})



server.get('/usuarios', (request, response) => {
    response.status(200).json(USUARIOS)
})

server.get('/usuarios/:usuarioId',

    checkSchema({
        usuarioId:{
            in: 'params',
            isInt: {
                options:{ min:1 }
            },
            toInt: true,
            errorMessage: 'Informe o ID do Usuário na URL.'
        }
    })

    ,(request , response) => {
   
    // const usuarioEncontrado = USUARIOS.find( function ususario(){
    //     return usuario.id === parseInt(ususarioId)
    // })
    
    //const usuarioId = request.params.usuarioId

    const errors = validationResult(request)
    if(!errors.isEmpty()){
        response.status(422).json({
            errors: errors.array()
        })
        return
    }
    
    const {usuarioId} = request.params
    const usuarioEncontrado = USUARIOS.find( usuario => usuario.id === usuarioId)
    
    if(!usuarioEncontrado){
        response.status(404).send('usuario não encontrado')
    }else{
        response.status(200).json(usuarioEncontrado)
    }

})

server.post('/usuarios',
checkSchema({
    nome:{
        in: 'body',
        isString: true,
        isLength:{
            options:{min:1}
        },
        trim: true,
        errorMessage: 'Informe o nome do Usuário.'
    },
    profissao:{
        in: 'body',
        optional: true,
        isString: true,
        isEmpty: false,
        trim: true,
        errorMessage: 'Informe a profissão do Usuário.'
    }
})
, (request, response) => {
    
    // let body = ""
    // request.on('data', (chunk) => {
    //     body += chunk
    // })

    // request.on('end', () => {
    //     const usuario = JSON.parse(body)
    //     usuario.id = USUARIOS.length + 1
    //     USUARIOS.push(usuario)
    //     response.status(201).json(usuario)
    // })

    const errors = validationResult(request)
    if(!errors.isEmpty()){
        response.status(422).json({
            errors: errors.array()
        })
        return
    }

    const {body} = request;
    const usuario = {
        id: USUARIOS.length + 1,
        nome: body.nome,
        profissao: body.profissao,
    }
    USUARIOS.push(usuario)
    response.status(201).json(usuario)

})

server.listen (porta, () => {
    console.log('servidor porta', porta)
})