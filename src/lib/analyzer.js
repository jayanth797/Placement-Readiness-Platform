
// Skill Categories and Keywords
const SKILL_KEYWORDS = {
    "Core CS": ["DSA", "Data Structures", "Algorithms", "OOP", "Object Oriented", "DBMS", "Database Management", "OS", "Operating Systems", "Networks", "Computer Networks", "System Design", "Distributed Systems"],
    "Languages": ["Java", "Python", "JavaScript", "JS", "TypeScript", "TS", "C++", "C#", "Go", "Golang", "Ruby", "Swift", "Kotlin", "Rust", "PHP"],
    "Web": ["React", "React.js", "Next.js", "Node", "Node.js", "Express", "Express.js", "Vue", "Angular", "HTML", "CSS", "REST", "GraphQL", "API", "Frontend", "Backend", "Full Stack"],
    "Data": ["SQL", "MySQL", "PostgreSQL", "Mongo", "MongoDB", "NoSQL", "Redis", "Cassandra", "Kafka", "Data Engineering", "ETL"],
    "Cloud/DevOps": ["AWS", "Azure", "GCP", "Google Cloud", "Docker", "Kubernetes", "K8s", "Jenkins", "CI/CD", "DevOps", "Linux", "Bash", "Shell"],
    "Testing": ["Selenium", "Cypress", "Playwright", "Jest", "Mocha", "JUnit", "PyTest", "Testing", "QA"]
};

/**
 * Extracts skills from job description text.
 * @param {string} text - The job description text.
 * @returns {Object} - Categorized skills found.
 */
export const extractSkills = (text) => {
    const lowerText = text.toLowerCase();
    const foundSkills = {};
    let hasSkills = false;

    for (const [category, keywords] of Object.entries(SKILL_KEYWORDS)) {
        const categorySkills = keywords.filter(keyword => {
            // Create a regex to match whole words/phrases, escaping special chars like + or .
            const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedKeyword.toLowerCase()}\\b`, 'i');
            // For short acronyms like "C" or "JS", ensure strict boundary.
            // For C++, it handles special chars.
            // Simple includes check is robust enough for most, but regex is better for "Go" vs "Going".
            // Let's stick to a simpler robust check:
            // We'll search for the keyword in the lowerText. 
            // To avoid matching "java" in "javascript" if "java" is keyword, we rely on boundaries or just inclusion for simplicity in this MVP.
            // However, "Go" matches "Good". So boundaries are needed.

            return new RegExp(`(^|\\W)${escapedKeyword.toLowerCase()}(\\W|$)`).test(lowerText);
        });

        if (categorySkills.length > 0) {
            foundSkills[category] = categorySkills;
            hasSkills = true;
        }
    }

    if (!hasSkills) {
        foundSkills["General"] = ["General fresher stack"];
    }

    return foundSkills;
};

/**
 * Calculates readiness score based on inputs.
 * @param {string} text 
 * @param {string} company 
 * @param {string} role 
 * @param {Object} skills 
 * @returns {number} Score (0-100)
 */
export const calculateScore = (text, company, role, skills) => {
    let score = 35; // Base score

    // Category bonus
    const categoriesPresent = Object.keys(skills).filter(k => k !== "General").length;
    score += Math.min(30, categoriesPresent * 5);

    // Metadata bonuses
    if (company && company.trim().length > 1) score += 10;
    if (role && role.trim().length > 1) score += 10;
    if (text && text.trim().length > 800) score += 10;

    return Math.min(100, score);
};

/**
 * Generates a 7-day preparation plan based on skills.
 * @param {Object} skills 
 * @returns {Array} 7-day plan objects { day, title, tasks }
 */
export const generatePlan = (skills) => {
    const categories = Object.keys(skills);
    const isFrontend = categories.includes("Web") && skills["Web"].some(s => ["react", "vue", "angular", "html", "css"].includes(s.toLowerCase()));
    const isBackend = categories.includes("Web") && skills["Web"].some(s => ["node", "express", "api"].includes(s.toLowerCase())) || categories.includes("Data");
    const isJava = categories.includes("Languages") && skills["Languages"].some(s => s.toLowerCase().includes("java"));

    const plan = [
        { day: 1, title: "Fundamentals Refresh", tasks: ["Review Aptitude basics (Time/Work, Percentages)", "Brush up on Core CS concepts (OS, DBMS)"] },
        { day: 2, title: "Language Mastery", tasks: ["Deep dive into your primary language features", "Practice basic list/string manipulation problems"] },
        { day: 3, title: "Data Structures", tasks: ["Focus on Arrays, Linked Lists, and Stacks", "Solve 5 medium difficulty problems"] },
        { day: 4, title: "Algorithms & Logic", tasks: ["Practice Sorting and Searching algorithms", "Solve problems involving Recursion"] },
    ];

    // Dynamic Day 5
    let day5Tasks = ["Build/Review a mini-project"];
    if (isFrontend) day5Tasks.push("Revise React Lifecycle / Hooks / State Management");
    else if (isBackend) day5Tasks.push("Review API Design, Auth, and Database normalization");
    else day5Tasks.push("Review OOP principles and Design Patterns");
    plan.push({ day: 5, title: "Specialization & Projects", tasks: day5Tasks });

    // Dynamic Day 6
    let day6Tasks = ["Mock Interview practice (Behavioral)"];
    if (categories.includes("Core CS")) day6Tasks.push("Revise OS concepts: Processes, Threads, Deadlocks");
    if (categories.includes("Data")) day6Tasks.push("Practice SQL Queries (Joins, Aggregates)");
    plan.push({ day: 6, title: "Interview Simulation", tasks: day6Tasks });

    plan.push({ day: 7, title: "Final Polish", tasks: ["Review resume and align with JD", "Relax and sleep well before the big day"] });

    return plan;
};

/**
 * Generates specific interview questions.
 * @param {Object} skills 
 * @returns {Array} List of questions
 */
export const generateQuestions = (skills) => {
    const questions = [
        "Tell me about a project you are most proud of.",
        "Why do you want to join our company?",
    ];

    const categories = Object.keys(skills);
    const allSkills = Object.values(skills).flat().map(s => s.toLowerCase());

    if (allSkills.includes("react")) questions.push("Explain the Virtual DOM and how React handles updates.");
    if (allSkills.includes("node") || allSkills.includes("node.js")) questions.push("How does the Event Loop work in Node.js?");
    if (allSkills.includes("sql") || categories.includes("Data")) questions.push("Explain Indexing in databases. When does it fail?");
    if (allSkills.includes("java")) questions.push("Explain the difference between JDK, JRE, and JVM.");
    if (allSkills.includes("python")) questions.push("How is memory managed in Python? Explain garbage collection.");
    if (categories.includes("Core CS")) questions.push("What is a Deadlock? What are the necessary conditions for it?");
    if (categories.includes("Cloud/DevOps")) questions.push("What is the difference between Docker and a Virtual Machine?");
    if (allSkills.includes("javascript") || allSkills.includes("js")) questions.push("Explain Closures and Hoisting with examples.");

    // Fill up to 10 with generics if needed
    const genericTechnical = [
        "Explain the difference between Process and Thread.",
        "What is ACID property in databases?",
        "Explain standard HTTP methods (GET, POST, PUT, DELETE).",
        "How does a hash map work?",
        "Explain the concept of Polymorphism."
    ];

    let i = 0;
    while (questions.length < 10 && i < genericTechnical.length) {
        if (!questions.includes(genericTechnical[i])) questions.push(genericTechnical[i]);
        i++;
    }

    return questions.slice(0, 10);
};

const ENTERPRISE_KEYWORDS = ["infosys", "tcs", "wipro", "amazon", "google", "microsoft", "oracle", "ibm", "capgemini", "accenture", "deloitte", "cognizant", "tech mahindra", "hcl"];

/**
 * analyzes company type and hiring focus.
 * @param {string} companyName 
 * @returns {Object} { type, size, focus }
 */
export const analyzeCompany = (companyName) => {
    if (!companyName) return { type: "Unknown", size: "Unknown", focus: "General Competency" };

    const lowerName = companyName.toLowerCase();
    const isEnterprise = ENTERPRISE_KEYWORDS.some(k => lowerName.includes(k));

    if (isEnterprise) {
        return {
            type: "Enterprise / Service-Based",
            size: "Large (2000+)",
            focus: "Strong fundamentals in Aptitude, Core CS (OS/DBMS), and standard DSA. Expect consistent, established interview patterns.",
            color: "blue"
        };
    }

    // Default to Startup/Product
    return {
        type: "Startup / Product-Based",
        size: "Mid-size or Startup (<2000)",
        focus: "Practical problem solving, development skills (Projects), and system design. Expect adaptibility and culture fit checks.",
        color: "purple"
    };
};

/**
 * Generates dynamic round mapping based on company type and skills.
 * @param {Object} skills 
 * @param {string} companyType 
 * @returns {Array} List of round objects
 */
export const generateRounds = (skills, companyType) => {
    const rounds = [];
    const isEnterprise = companyType.includes("Enterprise");
    const categories = Object.keys(skills);

    // Round 1
    if (isEnterprise) {
        rounds.push({
            name: "Round 1: Online Assessment",
            description: "Aptitude (Quants, Logical) + Basic Programming MCQs + 1-2 Coding Questions",
            whyMatters: "Elimination round. Speed and accuracy in aptitude are key here."
        });
    } else {
        rounds.push({
            name: "Round 1: Screening / HackerRank",
            description: "Practical Coding Challenge (DSA/Dev) or Take-home assignment",
            whyMatters: "Tests your hands-on coding ability and code quality before talking to humans."
        });
    }

    // Round 2
    if (isEnterprise) {
        rounds.push({
            name: "Round 2: Technical Interview (TR)",
            description: "DSA (Arrays/Strings), OOPS concepts, DBMS queries, and Project discussion",
            whyMatters: "Validates your core engineering concepts. Be ready to write code on paper/whiteboard."
        });
    } else {
        rounds.push({
            name: "Round 2: Technical Deep Dive",
            description: "Data Structures & Algorithms (Optimization focus) + Language internals",
            whyMatters: "Assess problem-solving depth. Can you optimize O(n^2) to O(n log n)?"
        });
    }

    // Round 3
    if (categories.includes("Web") && !isEnterprise) {
        rounds.push({
            name: "Round 3: System Design / Frameworks",
            description: "Discussions on Project Architecture, API design, State management (React/Redux), or DB choices",
            whyMatters: "Tests if you can build scalable, maintainable software, not just write loops."
        });
    } else if (isEnterprise) {
        rounds.push({
            name: "Round 3: Managerial (MR)",
            description: "Scenario-based questions, Project challenges, Team fit",
            whyMatters: "Checks communication skills and stability. Are you a long-term fit?"
        });
    } else {
        rounds.push({
            name: "Round 3: Hiring Manager",
            description: "Past experiences, behavioral questions, culture alignment",
            whyMatters: "The manager decides if they want to work with you daily."
        });
    }

    // Round 4
    rounds.push({
        name: isEnterprise ? "Round 4: HR Interview" : "Round 4: Culture Fit & Offer",
        description: "Salary negotiation, Relocation, Company policies",
        whyMatters: "Final check on logistics and attitude. Usually a formality if you reached here."
    });

    return rounds;
};

export const analyzeJD = (text, company, role) => {
    // 1. Extract Skills
    let extractedSkills = extractSkills(text);
    const hasSkills = Object.values(extractedSkills).some(arr => arr.length > 0);

    // 2. Fallback if no skills
    if (!hasSkills) {
        extractedSkills = {
            "Core CS": [],
            "Languages": [],
            "Web": [],
            "Data": [],
            "Cloud/DevOps": [],
            "Testing": [],
            "Other": ["Communication", "Problem solving", "Basic coding", "Projects"]
        };
    } else {
        // Ensure all keys exist even if empty
        const keys = ["Core CS", "Languages", "Web", "Data", "Cloud/DevOps", "Testing", "Other"];
        keys.forEach(k => {
            if (!extractedSkills[k]) extractedSkills[k] = [];
        });
    }

    // 3. Scores
    const baseScore = calculateScore(text, company, role, extractedSkills);

    // 4. Generate Content
    const plan = generatePlan(extractedSkills);
    const questions = generateQuestions(extractedSkills);
    const companyIntel = analyzeCompany(company);
    const rounds = generateRounds(extractedSkills, companyIntel.type);

    // Checklist Layout (Keep for legacy compatibility if needed, but we'll use rounds mostly)
    const checklist = {
        "Round 1": rounds[0] ? rounds[0].description.split('+').map(s => s.trim()) : [],
        "Round 2": rounds[1] ? rounds[1].description.split('+').map(s => s.trim()) : [],
        "Round 3": rounds[2] ? rounds[2].description.split('+').map(s => s.trim()) : [],
        "Round 4": rounds[3] ? rounds[3].description.split(',').map(s => s.trim()) : []
    };

    // 5. Return Standardized Schema
    return {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        company: company || "",
        role: role || "",
        jdText: text || "",
        extractedSkills,

        // Mapping & Content
        roundMapping: rounds, // Alias for 'rounds' to match req, keeping 'rounds' for UI compat if needed
        rounds, // Keeping this as primary for current UI
        checklist,
        plan7Days: plan, // Alias maps to 'plan'
        plan, // Keeping this
        questions,

        // Scoring
        baseScore,
        finalScore: baseScore, // Initially same
        readinessScore: baseScore, // Legacy mapping
        skillConfidenceMap: {}, // Empty start

        // Metadata
        companyIntel
    };
};
