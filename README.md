# ⚡ KitEnergia

**PWA para gestão de leituras de energia elétrica em imóveis com múltiplas unidades, com cálculo automático de consumo e emissão de fatura.**

[![Deploy](https://img.shields.io/badge/deploy-online-success?style=flat-square)](https://kitenergia.vercel.app/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![PWA](https://img.shields.io/badge/PWA-instalável-5A0FC8?style=flat-square)](https://web.dev/progressive-web-apps/)

### 🔗 [Ver aplicação online →](https://kitenergia.vercel.app/)

---

<p align="center">
  <img src="./docs/demo.gif" alt="Demonstração do KitEnergia: cadastro de leitura, dashboard de consumo e geração de fatura" width="300">
</p>

---

## 💡 O problema

Quem administra kitnets ou imóveis com várias unidades faz a mesma rotina todo mês: anda pelo prédio anotando a leitura de cada medidor num caderno, depois senta no computador, subtrai a leitura anterior, multiplica pela tarifa e digita uma fatura para cada inquilino. É demorado, e cada etapa manual é uma chance de errar um número.

O **KitEnergia** transforma isso em um fluxo só. A leitura é registrada no celular ali na frente do medidor  o app já traz a medição anterior preenchida para evitar erro de digitação — e a fatura sai pronta, com o demonstrativo de consumo calculado.

Como a medição acontece em campo, onde o sinal costuma ser ruim, o app foi construído como **PWA offline-first**: instala no celular e funciona sem conexão.

## ✨ Funcionalidades

- 🔐 **Autenticação com isolamento de dados** — cada usuário acessa apenas as próprias unidades e leituras
- 📝 **Cadastro inteligente de leituras** — puxa automaticamente a medição anterior do último registro, evitando erro de digitação
- 📊 **Dashboard de consumo** — consumo total em kWh, tarifa aplicada (R$/kWh), valor total a cobrar e destaque da unidade de maior consumo
- 🧾 **Emissão de fatura em PDF** — demonstrativo detalhado, linha digitável e QR Code PIX (simulado), pronto para imprimir ou enviar ao locatário
- 🔍 **Filtro e busca** — pesquisa por unidade, mês de referência, status ou número do contrato
- 📱 **Instalável e offline** — funciona na tela inicial do celular, com persistência local via `LocalStorage`

## 🧰 Tecnologias

| Camada | Stack |
|---|---|
| **Front-end** | React, Vite, JavaScript (ES6+), HTML5, CSS3 (mobile-first) |
| **PWA** | Service Workers, Web App Manifest |
| **Persistência** | Web Storage API (`LocalStorage`) |
| **Ferramentas** | Git, GitHub, VS Code |
| **Deploy** | Vercel |

> **Sobre a persistência:** os dados ficam no navegador do dispositivo via `LocalStorage`, o que mantém o app funcionando sem servidor e sem conexão. A evolução natural do projeto é migrar para um banco em nuvem, permitindo sincronizar as leituras entre dispositivos.

## 🚀 Como rodar localmente

Pré-requisitos: [Node.js](https://nodejs.org) 18 ou superior.

```bash
# Clone o repositório
git clone https://github.com/Veralucia0909/KitEnergia.git

# Entre na pasta
cd KitEnergia

# Instale as dependências
npm install

# Rode em modo de desenvolvimento
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

Para gerar a versão de produção e testar o comportamento PWA (Service Worker só funciona em build):

```bash
npm run build
npm run preview
```

## 📲 Instalar como app

O KitEnergia é um PWA — dá para instalar sem passar por loja de aplicativos:

- **Android (Chrome):** menu ⋮ → *Adicionar à tela inicial*
- **iOS (Safari):** botão compartilhar → *Adicionar à Tela de Início*
- **Desktop (Chrome/Edge):** ícone de instalação na barra de endereço

## 📁 Estrutura

```
KitEnergia/
├── public/            # Assets estáticos, manifest e ícones do PWA
├── src/               # Componentes, páginas e lógica da aplicação
├── index.html
├── vite.config.js     # Configuração do Vite
└── package.json
```

## 👩‍💻 Autoria

Desenvolvido por **[Vera Lúcia Paula de Lima](https://github.com/Veralucia0909)** no curso Técnico em Desenvolvimento de Sistemas do SENAI/SC.

A ideia veio da vivência anterior em manutenção elétrica: a rotina de leitura de medidores era um processo que eu conhecia de perto e sabia que dava para automatizar.

[Portfólio](https://veralucia-portfolio.vercel.app) · [LinkedIn](https://www.linkedin.com/in/verapaulalima)



