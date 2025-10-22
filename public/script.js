const API_URL = 'http://localhost:3001/produtos';

async function listarProdutos() {
    const tbody = document.getElementById('produtos-lista');
    tbody.innerHTML = '<tr><td colspan="6">Carregando produtos...</td></tr>';

    try {
        const response = await fetch(API_URL);
        const produtos = await response.json();

        tbody.innerHTML = '';

        produtos.forEach(produto => {
            const row = tbody.insertRow();

            row.insertCell().textContent = produto.id;
            row.insertCell().textContent = produto.descricao;
            row.insertCell().textContent = produto.quantidade;
            row.insertCell().textContent = produto.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            row.insertCell().textContent = produto.data_criacao;

            const deleteCell = row.insertCell();
            deleteCell.innerHTML = `<a href="#" class="action-link delete-link" onclick="deletarProduto(${produto.id})">Deletar</a>`;
        });

    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        tbody.innerHTML = '<tr><td colspan="6">Erro ao carregar os dados. Verifique o servidor.</td></tr>';
    }
}

async function cadastrarProduto(dados) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        if (response.ok) {
            alert('Produto cadastrado com sucesso!');
            document.getElementById('productForm').reset();
            document.getElementById("newProductModal").style.display = "none";
            listarProdutos();
        } else {
            alert('Erro ao cadastrar produto.');
        }
    } catch (error) {
        console.error('Erro no POST:', error);
        alert('Erro de conexão ao tentar cadastrar.');
    }
}

async function deletarProduto(id) {

    if (!confirm(`Tem certeza que deseja deletar o produto com ID ${id}?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (response.ok || response.status === 204) {
            alert(`Produto ID ${id} deletado com sucesso!`);
            listarProdutos();
        } else if (response.status === 404) {
            alert(`Erro: Produto ID ${id} não encontrado.`);
        }
        else {
            const errorData = await response.json();
            alert(`Erro ao deletar produto: ${errorData.error || 'Erro desconhecido.'}`);
        }

    } catch (error) {
        console.error('Erro de conexão ao tentar deletar:', error);
        alert('Erro de rede ou conexão ao tentar deletar.');
    }
}

const modal = document.getElementById("newProductModal");
const btn = document.getElementById("openModalBtn");
const span = document.getElementsByClassName("close-btn")[0];
const form = document.getElementById('productForm');

btn.onclick = (e) => { e.preventDefault(); modal.style.display = "block"; }
span.onclick = () => { modal.style.display = "none"; }
window.onclick = (event) => { if (event.target == modal) { modal.style.display = "none"; } }

form.onsubmit = function (e) {
    e.preventDefault();

    const dados = {
        descricao: document.getElementById('descricao').value,
        quantidade: parseInt(document.getElementById('quantidade').value),
        valor: parseFloat(document.getElementById('valor').value.replace(',', '.'))
    };

    cadastrarProduto(dados);
};

listarProdutos();