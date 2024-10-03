
import express from 'express'
import sql from './database.js'
import jwt from 'jsonwebtoken'
import { expressjwt } from "express-jwt"

// expressjwt({ secret: 'keys_hub', algorithms: ["HS256"]})

const router = express.Router()

router.get('/', async (req, res)=>{
    try{
        const data = await sql`select * from usuario`;
        return res.status(200).json(data)
    }
    catch{
        return res.status(404).json(`error`)
    }
})

router.post('/login', async (req, res)=>{
    try {
        const { email, senha } = req.body;
        if(email != null && email != "" && senha != null && senha != "")
        {
            const data = await sql`select id, nome from Usuario where email = ${email} and senha = ${senha}`;
            if(data.length == 0)
            {   
                return res.status(204).json('usuario ou senha incorreta')
            }
            //const token = jwt.sign({ email: email }, 'keys_hub', { algorithm: 'HS256' });
            return res.status(200).json({msg: 'ok'})
        }
            return res.status(400).json("bad request");

    } 
    catch (error){
        console.log(error)
        return res.status(500).json('Error on server!')
    }
})

router.post("/questao/new", async (req, res) => {
    //console.log(req.auth)
    //if (!req.auth.email) return res.status(401).json('Não autorizado');
        //res.status(200).json('autorizado!');
    try {
        const { enunciado, 
               imagem, 
               alternativa_a, 
               alternativa_b, 
               alternativa_c, 
               alternativa_d, 
               alternativa_e, 
               correta, 
               nivel,
               materia            
            } = req.body;
            
        await sql`insert into questao(
                  enunciado,
                  imagem,
                  alternativa_a,
                  alternativa_b,
                  alternativa_c,
                  alternativa_d,
                  alternativa_e, 
                  correta, 
                  nivel) 
                values(${enunciado}, 
                        ${imagem}, 
                        ${alternativa_a}, 
                        ${alternativa_b}, 
                        ${alternativa_c}, 
                        ${alternativa_d}, 
                        ${alternativa_e}, 
                        ${correta},
                        ${nivel})`

        const last_id = await sql`SELECT id FROM questao ORDER BY id DESC LIMIT 1`
        // last_id[0].id
        console.log(last_id[0].id)
        await sql`insert into questao_materia(id_questao, id_materia) values(${last_id[0].id}, ${materia})`
        return res.status(200).json(req.body)
    } 
    catch (error) {
        console.log(error)
        return res.status(500).json('error in insert new questao')
       
    }
})

router.put('/teste/:id',  async (req, res) =>{
    // console.log(req.auth)
    // if (!req.auth.email) return res.status(401).json('Não autorizado');
        // res.status(200).json('autorizado!');
    try {
        const { enunciado,
                imagem,
                alternativa_a,
                alternativa_b,
                alternativa_c,
                alternativa_d,
                alternativa_e, 
                correta, 
                nivel } = req.body;
        const { id } = req.params; 
        await sql`update questao set  = ${enunciado}, ${imagem}, ${alternativa_a}, ${alternativa_b}, 
        ${alternativa_c}, ${alternativa_d}, ${alternativa_e}, ${correta}, ${nivel} where id = ${id}`
        return res.status(200).json('atualizado com sucesso!')
    } catch (error) {
        return res.status(500).json('error in update questão')
    }
})

router.delete("/questao/:id", async(req, res)=>{
    try {
        const { id } = req.params;
        await sql`delete from questao where id = ${id}`
        return res.status(200).json('ok')
    } catch (error) {
        return res.status(500).json('error to delete questao', console.log(error))
    }
})

router.get('/teste/:materia', async (req, res)=>{
    //console.log(req.auth)
    //if (!req.auth.email) return res.status(401).json('Não autorizado');
        //res.status(200).json('autorizado!');
    try{
        const{ materia } = req.params; // tem que vir o id

        const teste = await sql`select q.id, q.enunciado, q.imagem, q.alternativa_a, q.alternativa_b, q.alternativa_c, alternativa_d, 
alternativa_e, correta, nivel from materia as m inner join questao_materia as qm on qm.id_materia = m.id inner join questao as q 
on q.id = qm.id_questao where m.id = ${materia}`
return res.status(200).json(teste)
    } 
    catch(error){
        console.log(error)
        return res.status(500).json('error ao encontrar')
    }
})

router.get("/testzin", async (req, res) => {
    try {
        const select = await sql`select * from teste`
        return res.status(200).json(select)
    } 
    catch (error) {
        return res.status(500).json('error ao encontrar')
    }
})  


export default router
