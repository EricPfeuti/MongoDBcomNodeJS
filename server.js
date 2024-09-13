const express = require('express');
const { MongoClient, ObjectId } = require('mongodb')
const app = express();
const methodOverride = require('method-override');

const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));

const url = 'mongodb://127.0.0.1:27017/';
const dbName = 'farmacia';
const collectionPaciente = 'pacientes';
const collectionMedicamento = 'medicamentos';
const collectionVenda = 'vendas';

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// COLEÇÃO PACIENTES
app.get('/verificarPacientes', (req, res) => {
    res.sendFile(__dirname + '/pages/pacientes.html');
});

// CADASTRO PACIENTES
app.get('/cadastroPaciente', (req, res) => {
    res.sendFile(__dirname + '/pages/cadastroPaciente.html');
});

app.post('/cadastroPaciente', async (req, res) => {

    const novoPaciente = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionPaciente);

        const result = await collection.insertOne(novoPaciente);
        console.log(`Paciente cadastro com sucesso. ID: ${result.insertedId}`);

        res.redirect('/');
    } catch (err) {
        console.error('Erro ao cadastrar o paciente:', err);
        res.status(500).send('Erro ao cadastrar o paciente. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.get('/pacientes', async (req, res) => {
    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionPaciente);

        const pacientes = await collection.find({}, { projection: { _id: 1, nome: 1, dataNascimento: 1, numeroCPF: 1 } }).toArray();

        res.json(pacientes);

    } catch (err) {
        console.error('Erro ao buscar pacientes:', err);
        res.status(500).send('Erro ao buscar pacientes. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

// ATUALIZAR PACIENTES
app.get('/atualizarpaciente', (req, res) => {
    res.sendFile(__dirname + '/pages/atualizarPaciente.html');
});

app.post('/atualizarpaciente', async (req, res) => {
    const { id, nome, dataNascimento, numeroCPF } = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionPaciente);

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: { nome, dataNascimento, numeroCPF }
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`Paciente com ID: ${id} atualizado com sucesso.`);
            res.redirect('/verificarPacientes');
        } else {
            res.status(404).send('Paciente não encontrado.')
        }
    } catch (err) {
        console.error('Erro ao atualizar o paciente:', err);
        res.status(500).send('Erro ao atualizar o paciente. Por favor, tente novamente mais tarde.')
    } finally {
        client.close();
    }

});

app.get('/paciente/:id', async (req, res) => {
    const { id } = req.params;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionPaciente);

        const paciente = await collection.findOne({ _id: new ObjectId(id) });

        if (!paciente) {
            return res.status(404).send('Paciente não encontrado.');
        }

        res.json(paciente);
    } catch (err) {
        console.error('Erro ao buscar o paciente:', err);
        res.status(500).send('Erro ao buscar o paciente. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }

});

// DELETAR PACIENTES
app.post('/deletarpaciente', async (req, res) => {
    const { id } = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionPaciente);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
            console.log(`Paciente com ID: ${id} deletado com sucesso.`);
            res.redirect('/verificarPacientes');
        } else {
            res.status(404).send('Paciente não encontrado.');
        }
    } catch (err) {
        console.error('Erro ao deletar o paciente:', err);
        res.status(500).send('Erro ao deletar o paciente. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }

});

// COLEÇÃO MEDICAMENTOS
app.get('/verificarMedicamentos', (req, res) => {
    res.sendFile(__dirname + '/pages/medicamentos.html');
});

// CADASTRO MEDICAMENTOS

app.get('/cadastroMedicamento', (req, res) => {
    res.sendFile(__dirname + '/pages/cadastroMedicamento.html');
});

app.post('/cadastroMedicamento', async (req, res) => {

    const novoMedicamento = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionMedicamento);

        const result = await collection.insertOne(novoMedicamento);
        console.log(`Medicamento cadastro com sucesso. ID: ${result.insertedId}`);

        res.redirect('/');
    } catch (err) {
        console.error('Erro ao cadastrar o medicamento:', err);
        res.status(500).send('Erro ao cadastrar o medicamento. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.get('/medicamentos', async (req, res) => {
    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionMedicamento);

        const medicamentos = await collection.find({}, { projection: { _id: 1, nomeMedicamento: 1, codigo: 1, dosagem: 1 } }).toArray();

        res.json(medicamentos);

    } catch (err) {
        console.error('Erro ao buscar medicamentos:', err);
        res.status(500).send('Erro ao buscar medicamentos. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

// ATUALIZAR MEDICAMENTOS
app.get('/atualizarmedicamento', (req, res) => {
    res.sendFile(__dirname + '/pages/atualizarMedicamento.html');
});

app.post('/atualizarmedicamento', async (req, res) => {
    const { id, nomeMedicamento, codigo, dosagem } = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionMedicamento);

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: { nomeMedicamento, codigo, dosagem }
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`Medicamento com ID: ${id} atualizado com sucesso.`);
            res.redirect('/verificarMedicamentos');
        } else {
            res.status(404).send('Medicamento não encontrado.')
        }
    } catch (err) {
        console.error('Erro ao atualizar o medicamento:', err);
        res.status(500).send('Erro ao atualizar o medicamento. Por favor, tente novamente mais tarde.')
    } finally {
        client.close();
    }

});

app.get('/medicamento/:id', async (req, res) => {
    const { id } = req.params;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionMedicamento);

        const medicamento = await collection.findOne({ _id: new ObjectId(id) });

        if (!medicamento) {
            return res.status(404).send('Medicamento não encontrado.');
        }

        res.json(medicamento);
    } catch (err) {
        console.error('Erro ao buscar o medicamento:', err);
        res.status(500).send('Erro ao buscar o medicamento. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }

});

// DELETAR MEDICAMENTOS
app.post('/deletarmedicamento', async (req, res) => {
    const { id } = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionMedicamento);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
            console.log(`Medicamento com ID: ${id} deletado com sucesso.`);
            res.redirect('/verificarMedicamentos');
        } else {
            res.status(404).send('Medicamento não encontrado.');
        }
    } catch (err) {
        console.error('Erro ao deletar o medicamento:', err);
        res.status(500).send('Erro ao deletar o medicamento. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }

});

// COLEÇÃO VENDAS
app.get('/verificarVendas', (req, res) => {
    res.sendFile(__dirname + '/pages/vendas.html');
});

// CADASTRO VENDAS

app.get('/cadastroVenda', (req, res) => {
    res.sendFile(__dirname + '/pages/cadastroVenda.html');
});

app.post('/cadastroVenda', async (req, res) => {
    const { nome, nomeMedicamento } = req.body;

    const novaVenda = req.body;

    const client = new MongoClient(url);

    const db = client.db(dbName);
    const vendaPaciente = db.collection(collectionPaciente);
    const nomePaciente = await vendaPaciente.findOne({ nome });
    const vendaMedicamento = db.collection(collectionMedicamento);
    const nomeRemedio = await vendaMedicamento.findOne({ nomeMedicamento });

    if (!nomePaciente) {
        return res.status(404).send('Nome do Paciente não cadastrado.');
    } else if (!nomeRemedio){
        return res.status(404).send('Nome do Medicamento não cadastrado.');
    }

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionVenda);

        const result = await collection.insertOne(novaVenda);
        console.log(`Venda cadastra com sucesso. ID: ${result.insertedId}`);

        res.redirect('/verificarVendas');
    } catch (err) {
        console.error('Erro ao cadastrar a venda:', err);
        res.status(500).send('Erro ao cadastrar a venda. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.get('/vendas', async (req, res) => {
    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionVenda);

        const vendas = await collection.find({}, { projection: { _id: 1,  nome: 1, dataCompra: 1, nomeMedicamento: 1, quantidade: 1 } }).toArray();

        res.json(vendas);

    } catch (err) {
        console.error('Erro ao buscar vendas:', err);
        res.status(500).send('Erro ao buscar vendas. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

// ATUALIZAR VENDAS
app.get('/atualizarvenda', (req, res) => {
    res.sendFile(__dirname + '/pages/atualizarVenda.html');
});

app.post('/atualizarvenda', async (req, res) => {
    const { id, dataCompra, nome, nomeMedicamento, quantidade } = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionVenda);

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: { dataCompra, nome, nomeMedicamento, quantidade }
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`Venda com ID: ${id} atualizada com sucesso.`);
            res.redirect('/verificarVendas');
        } else {
            res.status(404).send('Venda não encontrada.')
        }
    } catch (err) {
        console.error('Erro ao atualizar a venda:', err);
        res.status(500).send('Erro ao atualizar a venda. Por favor, tente novamente mais tarde.')
    } finally {
        client.close();
    }

});

app.get('/venda/:id', async (req, res) => {
    const { id } = req.params;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionVenda);

        const venda = await collection.findOne({ _id: new ObjectId(id) });

        if (!venda) {
            return res.status(404).send('Venda não encontrada.');
        }

        res.json(venda);
    } catch (err) {
        console.error('Erro ao buscar a venda:', err);
        res.status(500).send('Erro ao buscar a venda. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }

});

// DELETAR VENDAS
app.post('/deletarvenda', async (req, res) => {
    const { id } = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionVenda);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
            console.log(`Venda com ID: ${id} deletada com sucesso.`);
            res.redirect('/verificarVendas');
        } else {
            res.status(404).send('Venda não encontrada.');
        }
    } catch (err) {
        console.error('Erro ao deletar a venda:', err);
        res.status(500).send('Erro ao deletar a venda. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }

});

// FILTRAR MEDICAMENTO
app.get('/dados', async (req, res) => {
    res.sendFile(__dirname + '/pages/dados.html');
});

app.get('/filtrarNome', async (req, res) => {
    const { nomeMedicamento } = req.query;
    const client = new MongoClient(url);
 
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionMedicamento);
 
        const medicamentos = await collection.find({ nomeMedicamento: new RegExp(nomeMedicamento, 'i') }).toArray();
 
        res.json(medicamentos);

        console.log(medicamentos)
    } catch (err) {
        console.error('Erro ao buscar medicamentos:', err);
        res.status(500).send('Erro ao buscar medicamentos. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.listen(port, () => {
    console.log(`Servidor Node.js em execução em http://localhost:${port}`);
});