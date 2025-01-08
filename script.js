document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('nfseForm');
    const addItemButton = document.getElementById('addItem');
    const itensContainer = document.getElementById('itensContainer');
    const notaFiscal = document.getElementById('notaFiscal');
    const formContainer = document.getElementById('formContainer');
    const novaNota = document.getElementById('novaNota');

    function calcularImposto(valorVenda, taxa) {
        return (valorVenda * taxa) / 100;
    }

    function resetForm() {
        form.reset();
        itensContainer.innerHTML = '';
        notaFiscal.classList.remove('visible');
        formContainer.classList.remove('hidden');
    }

    addItemButton.addEventListener('click', function() {
        const itemRow = document.createElement('div');
        itemRow.className = 'item-row';
        itemRow.innerHTML = `
            <input type="text" placeholder="Nome do item" required>
            <input type="text" placeholder="Descrição do item" required>
            <button type="button" class="remove-item">Remover</button>
        `;
        itensContainer.appendChild(itemRow);
    });

    itensContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            const itemRow = e.target.parentElement;
            if (itensContainer.children.length > 1) {
                itemRow.remove();
            } else {
                alert('É necessário ter pelo menos um item!');
            }
        }
    });

    novaNota.addEventListener('click', resetForm);

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (itensContainer.children.length === 0) {
            alert('Adicione pelo menos um item antes de gerar a nota fiscal.');
            return;
        }

        const valorVenda = parseFloat(document.getElementById('valorVenda').value);
        const irpf = parseFloat(document.getElementById('irpf').value);
        const pis = parseFloat(document.getElementById('pis').value);
        const cofins = parseFloat(document.getElementById('cofins').value);
        const inss = parseFloat(document.getElementById('inss').value);
        const issqn = parseFloat(document.getElementById('isson').value);

        const valorIRPF = calcularImposto(valorVenda, irpf);
        const valorPIS = calcularImposto(valorVenda, pis);
        const valorCOFINS = calcularImposto(valorVenda, cofins);
        const valorINSS = calcularImposto(valorVenda, inss);
        const valorISSQN = calcularImposto(valorVenda, issqn);
        const totalImpostos = valorIRPF + valorPIS + valorCOFINS + valorINSS + valorISSQN;
        const valorLiquido = valorVenda - totalImpostos;

        const itens = [];
        document.querySelectorAll('.item-row').forEach(row => {
            const nome = row.querySelectorAll('input[type="text"]')[0].value;
            const descricao = row.querySelectorAll('input[type="text"]')[1].value;
            itens.push({ nome, descricao });
        });

        const dataEmissao = new Date().toLocaleDateString('pt-BR');
        const horaEmissao = new Date().toLocaleTimeString('pt-BR');

        const notaFiscalHTML = `
            <div style="margin-bottom: 1.5rem;">
                <p><strong>Data de Emissão:</strong> ${dataEmissao}</p>
                <p><strong>Hora de Emissão:</strong> ${horaEmissao}</p>
            </div>

            <h3>Itens da Nota</h3>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                    </tr>
                </thead>
                <tbody>
                    ${itens.map(item => `
                        <tr>
                            <td>${item.nome}</td>
                            <td>${item.descricao}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <h3>Impostos</h3>
            <table>
                <tbody>
                    <tr>
                        <td><strong>IRPF (${irpf}%)</strong></td>
                        <td>R$ ${valorIRPF.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td><strong>PIS (${pis}%)</strong></td>
                        <td>R$ ${valorPIS.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td><strong>COFINS (${cofins}%)</strong></td>
                        <td>R$ ${valorCOFINS.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td><strong>INSS (${inss}%)</strong></td>
                        <td>R$ ${valorINSS.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td><strong>ISSQN (${issqn}%)</strong></td>
                        <td>R$ ${valorISSQN.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e9ecef;">
                <p><strong>Valor Total:</strong> R$ ${valorVenda.toFixed(2)}</p>
                <p><strong>Total de Impostos:</strong> R$ ${totalImpostos.toFixed(2)}</p>
                <p><strong>Valor Líquido:</strong> R$ ${valorLiquido.toFixed(2)}</p>
            </div>
        `;

        document.getElementById('notaFiscalConteudo').innerHTML = notaFiscalHTML;
        formContainer.classList.add('hidden');
        notaFiscal.classList.add('visible');
    });
});
