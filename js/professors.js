document.addEventListener('DOMContentLoaded', function () {
    const professors = [
        {
            name: 'Salim Nahle',
            role: 'Research Professor, Head of the Data and Artificial Intelligence Department, Head of the Master’s in Big Data and Machine Learning.',
            domains: ['Data', 'Intelligence artificielle', 'Big Data', 'Machine learning'],
            description: 'Profil public associé aux formations et expertises data, IA, Big Data et machine learning à l’Efrei.',
            source: 'https://eng.efrei.fr/allianstic-research-laboratory/research-team/nahle-salim/'
        },
        {
            name: 'Mohamad Ghassany',
            role: 'Research Professor, Head of the Master “Big Data and Artificial Intelligence”.',
            domains: ['Big Data', 'Intelligence artificielle'],
            description: 'Profil public présenté dans l’équipe de recherche Efrei autour du Big Data et de l’intelligence artificielle.',
            source: 'https://eng.efrei.fr/allianstic-research-laboratory/research-team/'
        },
        {
            name: 'Fériel Bouakkaz',
            role: 'Research Professor à l’Efrei depuis 2019.',
            domains: ['Cryptographie', 'Sécurité d’infrastructure', 'Algorithmes', 'Java', 'IoT', '5G', 'Réseaux de capteurs'],
            description: 'Profil public lié à la cybersécurité, aux réseaux de capteurs, à l’IoT et aux infrastructures sécurisées.',
            source: 'https://eng.efrei.fr/allianstic-research-laboratory/research-team/feriel-bouakkaz/'
        },
        {
            name: 'Yessin Neggaz',
            role: 'Research Professor, Head of the Master Program in “Networks and Cloud Infrastructure”.',
            domains: ['Réseaux dynamiques', 'Algorithmes distribués', 'Cloud infrastructure'],
            description: 'Profil public orienté réseaux dynamiques, algorithmes distribués et infrastructures cloud.',
            source: 'https://eng.efrei.fr/allianstic-research-laboratory/research-team/yessin-neggaz/'
        },
        {
            name: 'Jean-Charles Huet',
            role: 'Research Professor, Head of the Master “Digital Transformation and Cloud Services”, Head of the Information Technology division.',
            domains: ['Systèmes d’information', 'Cloud', 'Bases de données avancées'],
            description: 'Profil public associé aux systèmes d’information, à la transformation numérique et aux services cloud.',
            source: 'https://eng.efrei.fr/allianstic-research-laboratory/research-team/jean-charles-huet-2/'
        },
        {
            name: 'Benoît Charroux',
            role: 'Research Professor.',
            domains: ['Blockchain', 'Java Spring', 'PaaS cloud', 'Architectures de systèmes d’information'],
            description: 'Profil public lié aux architectures applicatives, au cloud PaaS, à Java Spring et à la blockchain.',
            source: 'https://eng.efrei.fr/allianstic-research-laboratory/research-team/benoit-charroux-2/'
        },
        {
            name: 'Lamine Bougueroua',
            role: 'Enseignant-chercheur / Research Professor.',
            domains: ['Systèmes temps réel', 'Web intelligence', 'Multi-agents', 'Cloud', 'Software engineering'],
            description: 'Profil public associé aux systèmes temps réel, à l’intelligence web, aux approches multi-agents et au cloud.',
            source: 'https://eng.efrei.fr/allianstic-research-laboratory/research-team/lamine-bougueroua-2/'
        },
        {
            name: 'Layth Sliman',
            role: 'Research Professor à l’Efrei depuis 2010.',
            domains: ['IoT', 'Systèmes collaboratifs', 'Big Data', 'Blockchain', 'Cloud', 'Sécurité'],
            description: 'Profil public centré sur l’IoT, les systèmes collaboratifs, le cloud, le Big Data, la blockchain et la sécurité.',
            source: 'https://eng.efrei.fr/allianstic-research-laboratory/research-team/layth-sliman-2/'
        },
        {
            name: 'Dario Vieira',
            role: 'Research Professor, Head of Research in Connected Objects and Indoor Localization.',
            domains: ['Objets connectés', 'Localisation indoor', 'Réseaux'],
            description: 'Profil public lié aux objets connectés, à la localisation en intérieur et aux réseaux.',
            source: 'https://eng.efrei.fr/allianstic-research-laboratory/research-team/dario-vieira/'
        },
        {
            name: 'Hanen Ochi',
            role: 'Research Professor, Head of the Master “Business Intelligence and Analytics”.',
            domains: ['Data analysis', 'Data mining', 'Process mining', 'Vérification formelle'],
            description: 'Profil public associé à l’analyse de données, au data mining, au process mining et à la vérification formelle.',
            source: 'https://eng.efrei.fr/allianstic-research-laboratory/research-team/hanen-ochi-2/'
        },
        {
            name: 'Nicolas Sicard',
            role: 'Assistant Professor and Director of Studies à l’Efrei.',
            domains: ['Algorithmique', 'Visualisation 3D', 'Data mining parallèle'],
            description: 'Profil public lié à l’algorithmique, à la visualisation 3D et au data mining parallèle.',
            source: 'https://eng.efrei.fr/allianstic-research-laboratory/research-team/sicard-nicolas/'
        },
        {
            name: 'Katarzyna Węgrzyn-Wolska',
            role: 'Professor and Director of Research, Director of Efrei Research Lab.',
            domains: ['Informatique', 'Recherche appliquée', 'Systèmes temps réel'],
            description: 'Profil public associé à la direction de la recherche Efrei et aux activités de recherche appliquée en informatique.',
            source: 'https://eng.efrei.fr/allianstic-research-laboratory/research-team/katarzyna-wegrzyn-wolska/'
        }
    ];

    const grid = document.getElementById('professors-grid');
    if (!grid) return;

    professors.forEach((professor) => {
        const card = document.createElement('article');
        card.className = 'professor-card';

        const header = document.createElement('div');
        header.className = 'professor-card-header';

        const initials = document.createElement('span');
        initials.className = 'professor-initials';
        initials.setAttribute('aria-hidden', 'true');
        initials.textContent = getInitials(professor.name);

        const titleGroup = document.createElement('div');

        const name = document.createElement('h3');
        name.textContent = professor.name;

        const role = document.createElement('p');
        role.className = 'professor-role';
        role.textContent = professor.role;

        titleGroup.append(name, role);
        header.append(initials, titleGroup);

        const description = document.createElement('p');
        description.className = 'professor-description';
        description.textContent = professor.description;

        const domains = document.createElement('ul');
        domains.className = 'professor-domains';
        domains.setAttribute('aria-label', `Domaines d’expertise de ${professor.name}`);

        professor.domains.forEach((domain) => {
            const item = document.createElement('li');
            item.textContent = domain;
            domains.appendChild(item);
        });

        const source = document.createElement('a');
        source.className = 'professor-source';
        source.href = professor.source;
        source.target = '_blank';
        source.rel = 'noopener noreferrer';
        source.textContent = `Voir le profil de ${professor.name}`;

        card.append(header, description, domains, source);
        grid.appendChild(card);
    });

    function getInitials(name) {
        return name
            .split(' ')
            .filter(Boolean)
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
    }
});
