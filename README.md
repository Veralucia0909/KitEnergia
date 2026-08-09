# ⚡ KitEnergia  Controle de Leitura de Energia

> 📱 **Progressive Web App (PWA)** desenvolvido como projeto final da 2° semestre Aula de React do curso de Desenvolvimento de Sistemas (SENAI/SC).  
> Sistema web para gestão, cálculo automatizado de consumo de energia e emissão de faturas para unidades habitacionais (kitnets).

## 💡 Sobre o Projeto

O **KitEnergia** foi idealizado para facilitar o gerenciamento do consumo de energia elétrica em imóveis com múltiplas unidades (kitnets). O sistema automatiza o cálculo com base na tarifa vigente, gerencia o histórico de medições, calcula valores totais a cobrar e gera faturas personalizadas prontas para impressão ou envio ao locatário.

Por ser uma aplicação **PWA (Progressive Web App)**, pode ser instalada diretamente no celular ou computador, funcionando perfeitamente em telas móveis com suporte a uso offline via **LocalStorage**.

## ✨ Principais Funcionalidades

* 🔐 **Autenticação & Isolamento:** Login com perfil individual e dados isolados por usuário.
* 📝 **Cadastro Inteligente de Leituras:** Puxa automaticamente a leitura anterior do último registro para evitar erros de digitação.
* 📊 **Dashboard de Consumo:** Exibe métricas de consumo total em kWh, tarifa atual aplicada (R$/kWh), total geral a cobrar e destaca a unidade de maior consumo.
* 🧾 **Emissão de Faturas em PDF:** Geração de fatura detalhada com demonstrativo de consumo, linha digitável e QR Code PIX para pagamento fictício.
* 🔍 **Filtro & Busca:** Pesquisa dinâmica por unidade/kitnet, mês de referência, status ou número do contrato.
* 💾 **Persistência Local:** Salvamento e gestão de dados via `LocalStorage` do navegador.

## 🛠️ Tecnologias Utilizadas

* **Front-end:** React, Vite, JavaScript (ES6+), HTML5, CSS3 (Mobile-First)
* **Persistência de Dados:** Web Storage API (`LocalStorage`)
* **Recursos PWA:** Web App Manifest, Service Workers
* **Ferramentas:** Git, GitHub, VS Code


