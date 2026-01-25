const translations = {
    'en': {
        'hero-subtitle': 'Helping companies reduce manual work and errors using automation and AI',
        'services-title': 'Our Services',
        'service-1-title': 'Automatic Email Classification',
        'service-1-desc': 'Intelligent sorting and categorization of incoming emails to streamline your workflow',
        'service-2-title': 'Daily Ticket Summary',
        'service-2-desc': 'Automated generation of comprehensive ticket summaries to keep your team informed',
        'service-3-title': 'Data Extraction from PDFs to Excel',
        'service-3-desc': 'Convert unstructured PDF data into organized Excel spreadsheets automatically',
        'service-4-title': 'Automatic Report Generation',
        'service-4-desc': 'Create detailed reports automatically from your data sources',
        'service-5-title': 'Internal Chat for Documents',
        'service-5-desc': 'AI-powered chat interface to query and interact with your document databases',
        'reviews-title': 'Client Reviews',
        'btn-add-review': 'Add Review',
        'add-review-form-title': 'Add New Review',
        'placeholder-name': 'Name',
        'placeholder-company': 'Company',
        'placeholder-text': 'Review text',
        'placeholder-date': 'Date (e.g., January 2025)',
        'label-rating': 'Rating: ',
        'btn-save': 'Save Review',
        'btn-cancel': 'Cancel',
        'contact-title': 'Ready to Transform Your Business?',
        'contact-subtitle': "Let's discuss how AI automation can reduce manual work and eliminate errors in your operations",
        'btn-contact': 'Get in Touch',
        'footer-rights': 'All rights reserved.',
        'confirm-delete': 'Are you sure you want to delete this review?',
        'alert-fill': 'Please fill in at least the name and review text'
    },
    'pt-BR': {
        'hero-subtitle': 'Ajudando empresas a reduzir trabalho manual e erros usando automação e IA',
        'services-title': 'Nossos Serviços',
        'service-1-title': 'Classificação Automática de Emails',
        'service-1-desc': 'Triagem e categorização inteligente de emails recebidos para otimizar seu fluxo de trabalho',
        'service-2-title': 'Resumo Diário de Tickets',
        'service-2-desc': 'Geração automática de resumos abrangentes de tickets para manter sua equipe informada',
        'service-3-title': 'Extração de Dados de PDFs para Excel',
        'service-3-desc': 'Converta dados não estruturados de PDF em planilhas Excel organizadas automaticamente',
        'service-4-title': 'Geração Automática de Relatórios',
        'service-4-desc': 'Crie relatórios detalhados automaticamente a partir de suas fontes de dados',
        'service-5-title': 'Chat Interno para Documentos',
        'service-5-desc': 'Interface de chat baseada em IA para consultar e interagir com seus bancos de documentos',
        'reviews-title': 'Avaliações de Clientes',
        'btn-add-review': 'Adicionar Avaliação',
        'add-review-form-title': 'Adicionar Nova Avaliação',
        'placeholder-name': 'Nome',
        'placeholder-company': 'Empresa',
        'placeholder-text': 'Texto da avaliação',
        'placeholder-date': 'Data (ex: Janeiro 2025)',
        'label-rating': 'Avaliação: ',
        'btn-save': 'Salvar Avaliação',
        'btn-cancel': 'Cancelar',
        'contact-title': 'Pronto para Transformar seu Negócio?',
        'contact-subtitle': 'Vamos discutir como a automação com IA pode reduzir o trabalho manual e eliminar erros em suas operações',
        'btn-contact': 'Entrar em Contato',
        'footer-rights': 'Todos os direitos reservados.',
        'confirm-delete': 'Tem certeza que deseja excluir esta avaliação?',
        'alert-fill': 'Por favor, preencha pelo menos o nome e o texto da avaliação'
    }
};

let currentLang = 'en';

let reviews = {
    'en': [
        { id: 1, name: "Maria Santos", company: "TechCorp Solutions", rating: 5, text: "Leandro transformed our email management system. We now save 15 hours per week on email classification alone.", date: "December 2024" },
        { id: 2, name: "Carlos Rodriguez", company: "Global Logistics Inc", rating: 5, text: "The PDF data extraction solution has been a game-changer for our operations. Exceptional work!", date: "November 2024" },
        { id: 3, name: "Wilson Neto", company: "Pediatric Surgeon/Hospital Technical Director", rating: 5, text: "The electronic scheduling system developed for the Pediatric Surgery service at the Hospital de Clínicas de Porto Alegre significantly transformed the organization of care, managing over 500 patients and integrating the routine of more than 14 medical heads with complete stability. The tool profoundly altered the scheduling and surgical preparation process, becoming an essential part of the service's workflow and resulting in high-quality work, bringing more organization, predictability, and real efficiency gains to a highly complex environment. The service provided was excellent and very well executed. Leandro's work brought organization, predictability, and real efficiency gains.", date: "December 2019" }
    ],
    'pt-BR': [
        { id: 1, name: "Maria Santos", company: "TechCorp Solutions", rating: 5, text: "O Leandro transformou nosso sistema de gestão de e-mails. Agora economizamos 15 horas por semana apenas na classificação.", date: "Dezembro 2024" },
        { id: 2, name: "Carlos Rodriguez", company: "Global Logistics Inc", rating: 5, text: "A solução de extração de dados de PDF mudou o patamar das nossas operações. Trabalho excepcional!", date: "Novembro 2024" },
        { id: 3, name: "Wilson Ferreira", company: "Cirurgião Pediátrico/ Diretor Técnico Hospitalar", rating: 5, text: "A agenda eletrônica desenvolvida para o serviço de Cirurgia Pediátrica do Hospital de Clínicas de Porto Alegre transformou de forma significativa a organização do atendimento, passando a gerenciar mais de 500 pacientes e integrar a rotina de mais de 14 chefias médicas com estabilidade total. A ferramenta alterou profundamente o processo de marcações e preparo cirúrgico, tornou-se parte essencial do fluxo do serviço e resultou em um trabalho de alta qualidade, trazendo mais organização, previsibilidade e ganhos reais de eficiência para um ambiente de alta complexidade. o serviço prestado foi excelente e muito bem executado. O trabalho do Leandro trouxe organização, previsibilidade e ganho real de eficiência.", date: "Dezembro 2019" }
    ]
};

function changeLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerText = translations[lang][key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = translations[lang][key];
    });

    renderReviews();
}

function detectLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const lang = browserLang.startsWith('pt') ? 'pt-BR' : 'en';
    document.getElementById('languageSelect').value = lang;
    changeLanguage(lang);
}

function renderReviews() {
    const grid = document.getElementById('reviewsGrid');
    const langReviews = reviews[currentLang] || reviews['en'];
    
    grid.innerHTML = langReviews.map(review => `
        <div class="review-card">
            <div class="stars">
                ${Array(review.rating).fill('<svg class="star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>').join('')}
            </div>
            <p class="review-text">"${review.text}"</p>
            <div class="review-footer">
                <p class="review-name">${review.name}</p>
                <p class="review-company">${review.company}</p>
                <p class="review-date">${review.date}</p>
            </div>
        </div>
    `).join('');
}

// Initialize
detectLanguage();
