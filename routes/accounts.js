import express from "express";
import { promises as fs, write} from "fs";

const {readFile, writeFile} = fs;

const router = express.Router();


router.post("/", async (req, res) => {
    try{
        let account = req.body;
        const data = JSON.parse(await readFile(global.fileName));
        account = {id: data.nextId++, ...account};
        
        data.accounts.push(account);

        console.log(account);

        await writeFile(global.fileName, JSON.stringify(data, null, 2));

    }
    catch (err){
        res.status(400).send({ error: err.message});
        console.log(err);
    }
    res.end();
});

router.get("/", async(req, res) => {
    try{
        const  data = JSON.parse(await readFile(global.fileName));
        delete data.nextId;
        res.send(data);
    }
    catch(err){
        res.status(400).send({ error: err.message});
    }
});

router.get("/:id", async(req, res) => {
    try{
        const  data = JSON.parse(await readFile(global.fileName));
        const account = data.accounts.find(account => account.id === parseInt(req.params.id));
        res.send(account);
    }
    catch(err){
        res.status(400).send({ error: err.message});
    }
});

router.delete("/:id", async(req, res) => {
    try{
        const  data = JSON.parse(await readFile(global.fileName));
        const accountIndex = data.accounts.findIndex(account => account.id === parseInt(req.params.id));
        data.accounts.splice(accountIndex, 1);

        await writeFile(global.fileName, JSON.stringify(data, null, 2));
        res.send(data);
        res.end();
    }
    catch(err){
        res.status(400).send({ error: err.message});
    }
});

router.put("/", async(req, res) => {
    try{
        const account = req.body;
        const data = JSON.parse(await readFile(global.fileName));
        const index = data.accounts.findIndex(a => a.id === account.id);
        data.accounts[index] = account;
        await writeFile(global.fileName, JSON.stringify(data, null, 2));
        res.send(data.accounts.index);
    }
    catch(err){
        res.status(400).send({ error: err.message});
    }
});


router.patch("/updateBalance", async(req, res) => {
    try{
        const account = req.body;
        const data = JSON.parse(await readFile(global.fileName));
        const index = data.accounts.findIndex(a => a.id === account.id);
        data.accounts[index].balance = account.balance;
        await writeFile(global.fileName, JSON.stringify(data, null, 2));
        res.send(data.accounts[index]);
    }
    catch(err){
        res.status(400).send({ error: err.message});
    }
});


export default router;