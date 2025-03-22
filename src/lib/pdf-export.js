// Update the exportToPDF function to accept templateStyle parameter
export const exportToPDF = (resume, templateStyle = "modern") => {
  // Create a hidden element with the resume content in a professional format
  const element = document.createElement("div")

  // Apply different styles based on template
  switch (templateStyle) {
    case "professional":
      element.innerHTML = getProfessionalTemplate(resume)
      break
    case "creative":
      element.innerHTML = getCreativeTemplate(resume)
      break
    case "minimal":
      element.innerHTML = getMinimalTemplate(resume)
      break
    case "modern":
    default:
      element.innerHTML = getModernTemplate(resume)
      break
  }

  document.body.appendChild(element)

  // Use browser's print functionality to save as PDF
  window.print()

  // Remove the element after printing
  document.body.removeChild(element)
}

// Modern template (current style)
const getModernTemplate = (resume) => {
  return `
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      line-height: 1.5;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .resume-container {
      max-width: 21cm;
      margin: 0 auto;
      padding: 2cm;
    }
    .header {
      text-align: center;
      margin-bottom: 1.5cm;
      border-bottom: 1px solid #ddd;
      padding-bottom: 0.5cm;
    }
    .name {
      font-size: 24pt;
      font-weight: bold;
      margin: 0;
      color: #2563eb;
    }
    .title {
      font-size: 14pt;
      margin: 0.3cm 0 0.5cm 0;
      color: #4b5563;
    }
    .contact-info {
      font-size: 10pt;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1em;
    }
    .section {
      margin-bottom: 1cm;
    }
    .section-title {
      font-size: 14pt;
      font-weight: bold;
      border-bottom: 1px solid #ddd;
      padding-bottom: 0.2cm;
      margin-bottom: 0.3cm;
      color: #2563eb;
    }
    .section-content {
      font-size: 10pt;
    }
    .two-column {
      display: flex;
      gap: 1cm;
    }
    .main-column {
      flex: 2;
    }
    .side-column {
      flex: 1;
    }
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.3cm;
    }
    .skill-item {
      background-color: #f3f4f6;
      padding: 0.1cm 0.3cm;
      border-radius: 0.2cm;
      font-size: 9pt;
    }
    ul {
      padding-left: 1cm;
      margin: 0.3cm 0;
    }
    li {
      margin-bottom: 0.2cm;
    }
    p {
      margin: 0.2cm 0;
    }
    strong {
      font-weight: bold;
    }
    a {
      color: #2563eb;
      text-decoration: none;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
  <div class="resume-container">
    <div class="header">
      <h1 class="name">${resume.name || "Your Name"}</h1>
      ${resume.title ? `<h2 class="title">${resume.title}</h2>` : ""}
      <div class="contact-info">
        ${
          resume.contact
            ? resume.contact
                .split("\n")
                .map((line) => `<span>${line}</span>`)
                .join("")
            : ""
        }
      </div>
    </div>
    
    <div class="two-column">
      <div class="main-column">
        ${
          resume.bio
            ? `
          <div class="section">
            <h3 class="section-title">Professional Summary</h3>
            <div class="section-content">
              ${resume.bio.replace(/\n/g, "<br>")}
            </div>
          </div>
        `
            : ""
        }
        
        ${
          resume.experience
            ? `
          <div class="section">
            <h3 class="section-title">Experience</h3>
            <div class="section-content">
              ${formatMarkdownForPDF(resume.experience)}
            </div>
          </div>
        `
            : ""
        }
        
        ${
          resume.projects
            ? `
          <div class="section">
            <h3 class="section-title">Projects</h3>
            <div class="section-content">
              ${formatMarkdownForPDF(resume.projects)}
            </div>
          </div>
        `
            : ""
        }
      </div>
      
      <div class="side-column">
        ${
          resume.skills
            ? `
          <div class="section">
            <h3 class="section-title">Skills</h3>
            <div class="skills-list">
              ${resume.skills
                .split(",")
                .map((skill) => `<span class="skill-item">${skill.trim()}</span>`)
                .join("")}
            </div>
          </div>
        `
            : ""
        }
        
        ${
          resume.education
            ? `
          <div class="section">
            <h3 class="section-title">Education</h3>
            <div class="section-content">
              ${formatMarkdownForPDF(resume.education)}
            </div>
          </div>
        `
            : ""
        }
      </div>
    </div>
  </div>
`
}

// Professional template
const getProfessionalTemplate = (resume) => {
  return `
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    body {
      font-family: 'Times New Roman', serif;
      line-height: 1.5;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .resume-container {
      max-width: 21cm;
      margin: 0 auto;
      padding: 0;
    }
    .header {
      margin-bottom: 1cm;
    }
    .name {
      font-size: 18pt;
      font-weight: bold;
      margin: 0;
      color: #000;
      border-bottom: 2px solid #000;
      padding-bottom: 0.2cm;
    }
    .title {
      font-size: 12pt;
      margin: 0.3cm 0;
      color: #333;
    }
    .contact-info {
      font-size: 10pt;
      margin-top: 0.3cm;
    }
    .contact-item {
      display: inline-block;
      margin-right: 1cm;
    }
    .section {
      margin-bottom: 1cm;
    }
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 0.3cm;
      color: #000;
    }
    .section-content {
      font-size: 10pt;
    }
    .summary {
      border-left: 4px solid #ddd;
      padding-left: 0.5cm;
    }
    ul {
      padding-left: 1cm;
      margin: 0.3cm 0;
    }
    li {
      margin-bottom: 0.2cm;
    }
    p {
      margin: 0.2cm 0;
    }
    strong {
      font-weight: bold;
    }
    a {
      color: #000;
      text-decoration: none;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
  <div class="resume-container">
    <div class="header">
      <h1 class="name">${resume.name || "Your Name"}</h1>
      ${resume.title ? `<h2 class="title">${resume.title}</h2>` : ""}
      <div class="contact-info">
        ${
          resume.contact
            ? resume.contact
                .split("\n")
                .map((line) => `<span class="contact-item">${line}</span>`)
                .join("")
            : ""
        }
      </div>
    </div>
    
    ${
      resume.bio
        ? `
      <div class="section">
        <h3 class="section-title">Professional Summary</h3>
        <div class="section-content summary">
          ${resume.bio.replace(/\n/g, "<br>")}
        </div>
      </div>
    `
        : ""
    }
    
    ${
      resume.experience
        ? `
      <div class="section">
        <h3 class="section-title">Experience</h3>
        <div class="section-content">
          ${formatMarkdownForPDF(resume.experience)}
        </div>
      </div>
    `
        : ""
    }
    
    ${
      resume.education
        ? `
      <div class="section">
        <h3 class="section-title">Education</h3>
        <div class="section-content">
          ${formatMarkdownForPDF(resume.education)}
        </div>
      </div>
    `
        : ""
    }
    
    ${
      resume.skills
        ? `
      <div class="section">
        <h3 class="section-title">Skills</h3>
        <div class="section-content">
          ${resume.skills}
        </div>
      </div>
    `
        : ""
    }
    
    ${
      resume.projects
        ? `
      <div class="section">
        <h3 class="section-title">Projects</h3>
        <div class="section-content">
          ${formatMarkdownForPDF(resume.projects)}
        </div>
      </div>
    `
        : ""
    }
  </div>
`
}

// Creative template
const getCreativeTemplate = (resume) => {
  return `
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      line-height: 1.5;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .resume-container {
      max-width: 21cm;
      margin: 0 auto;
      padding: 0;
    }
    .header {
      background-color: #2563eb;
      color: white;
      padding: 1cm;
      margin-bottom: 1cm;
      border-radius: 0.3cm;
    }
    .name {
      font-size: 24pt;
      font-weight: bold;
      margin: 0;
    }
    .title {
      font-size: 14pt;
      margin: 0.3cm 0;
      opacity: 0.9;
    }
    .contact-info {
      font-size: 10pt;
      margin-top: 0.5cm;
      opacity: 0.9;
    }
    .contact-item {
      display: inline-block;
      margin-right: 0.5cm;
    }
    .section {
      margin-bottom: 1cm;
    }
    .section-title {
      font-size: 14pt;
      font-weight: bold;
      color: #2563eb;
      margin-bottom: 0.3cm;
      display: flex;
      align-items: center;
    }
    .section-title::before {
      content: "";
      display: inline-block;
      width: 1cm;
      height: 0.1cm;
      background-color: #2563eb;
      margin-right: 0.3cm;
    }
    .section-content {
      font-size: 10pt;
    }
    .two-column {
      display: flex;
      gap: 1cm;
    }
    .main-column {
      flex: 2;
    }
    .side-column {
      flex: 1;
      background-color: #f8f9fa;
      padding: 0.5cm;
      border-radius: 0.3cm;
    }
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.3cm;
    }
    .skill-item {
      background-color: #e6f0ff;
      color: #2563eb;
      padding: 0.1cm 0.3cm;
      border-radius: 0.2cm;
      font-size: 9pt;
    }
    ul {
      padding-left: 1cm;
      margin: 0.3cm 0;
    }
    li {
      margin-bottom: 0.2cm;
    }
    p {
      margin: 0.2cm 0;
    }
    strong {
      font-weight: bold;
    }
    a {
      color: #2563eb;
      text-decoration: none;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
  <div class="resume-container">
    <div class="header">
      <h1 class="name">${resume.name || "Your Name"}</h1>
      ${resume.title ? `<h2 class="title">${resume.title}</h2>` : ""}
      <div class="contact-info">
        ${
          resume.contact
            ? resume.contact
                .split("\n")
                .map((line) => `<span class="contact-item">${line}</span>`)
                .join("")
            : ""
        }
      </div>
    </div>
    
    <div class="two-column">
      <div class="main-column">
        ${
          resume.bio
            ? `
          <div class="section">
            <h3 class="section-title">Professional Summary</h3>
            <div class="section-content">
              ${resume.bio.replace(/\n/g, "<br>")}
            </div>
          </div>
        `
            : ""
        }
        
        ${
          resume.experience
            ? `
          <div class="section">
            <h3 class="section-title">Experience</h3>
            <div class="section-content">
              ${formatMarkdownForPDF(resume.experience)}
            </div>
          </div>
        `
            : ""
        }
        
        ${
          resume.projects
            ? `
          <div class="section">
            <h3 class="section-title">Projects</h3>
            <div class="section-content">
              ${formatMarkdownForPDF(resume.projects)}
            </div>
          </div>
        `
            : ""
        }
      </div>
      
      <div class="side-column">
        ${
          resume.skills
            ? `
          <div class="section">
            <h3 class="section-title">Skills</h3>
            <div class="skills-list">
              ${resume.skills
                .split(",")
                .map((skill) => `<span class="skill-item">${skill.trim()}</span>`)
                .join("")}
            </div>
          </div>
        `
            : ""
        }
        
        ${
          resume.education
            ? `
          <div class="section">
            <h3 class="section-title">Education</h3>
            <div class="section-content">
              ${formatMarkdownForPDF(resume.education)}
            </div>
          </div>
        `
            : ""
        }
      </div>
    </div>
  </div>
`
}

// Minimal template
const getMinimalTemplate = (resume) => {
  return `
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      line-height: 1.5;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .resume-container {
      max-width: 21cm;
      margin: 0 auto;
      padding: 0;
    }
    .header {
      margin-bottom: 1cm;
    }
    .name {
      font-size: 16pt;
      font-weight: normal;
      margin: 0;
      color: #333;
    }
    .title {
      font-size: 12pt;
      margin: 0.2cm 0;
      color: #666;
    }
    .contact-info {
      font-size: 9pt;
      margin-top: 0.3cm;
      padding-top: 0.3cm;
      border-top: 1px solid #eee;
      color: #666;
    }
    .contact-item {
      display: inline-block;
      margin-right: 0.5cm;
    }
    .section {
      margin-bottom: 0.8cm;
    }
    .section-title {
      font-size: 11pt;
      font-weight: 500;
      margin-bottom: 0.2cm;
      color: #333;
    }
    .section-content {
      font-size: 9pt;
    }
    ul {
      padding-left: 0.8cm;
      margin: 0.2cm 0;
    }
    li {
      margin-bottom: 0.1cm;
    }
    p {
      margin: 0.1cm 0;
    }
    strong {
      font-weight: 500;
    }
    a {
      color: #333;
      text-decoration: none;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
  <div class="resume-container">
    <div class="header">
      <h1 class="name">${resume.name || "Your Name"}</h1>
      ${resume.title ? `<h2 class="title">${resume.title}</h2>` : ""}
      <div class="contact-info">
        ${
          resume.contact
            ? resume.contact
                .split("\n")
                .map((line) => `<span class="contact-item">${line}</span>`)
                .join("")
            : ""
        }
      </div>
    </div>
    
    ${
      resume.bio
        ? `
      <div class="section">
        <h3 class="section-title">About</h3>
        <div class="section-content">
          ${resume.bio.replace(/\n/g, "<br>")}
        </div>
      </div>
    `
        : ""
    }
    
    ${
      resume.experience
        ? `
      <div class="section">
        <h3 class="section-title">Experience</h3>
        <div class="section-content">
          ${formatMarkdownForPDF(resume.experience)}
        </div>
      </div>
    `
        : ""
    }
    
    ${
      resume.education
        ? `
      <div class="section">
        <h3 class="section-title">Education</h3>
        <div class="section-content">
          ${formatMarkdownForPDF(resume.education)}
        </div>
      </div>
    `
        : ""
    }
    
    ${
      resume.skills
        ? `
      <div class="section">
        <h3 class="section-title">Skills</h3>
        <div class="section-content">
          ${resume.skills}
        </div>
      </div>
    `
        : ""
    }
    
    ${
      resume.projects
        ? `
      <div class="section">
        <h3 class="section-title">Projects</h3>
        <div class="section-content">
          ${formatMarkdownForPDF(resume.projects)}
        </div>
      </div>
    `
        : ""
    }
  </div>
`
}

// Format markdown for PDF export
function formatMarkdownForPDF(text) {
  if (!text) return ""

  // Handle headers
  text = text.replace(
    /^## (.*?)$/gm,
    '<h4 style="font-size: 11pt; font-weight: bold; margin: 0.4cm 0 0.2cm 0;">$1</h4>',
  )
  text = text.replace(/^# (.*?)$/gm, '<h3 style="font-size: 12pt; font-weight: bold; margin: 0.5cm 0 0.2cm 0;">$1</h3>')

  // Handle bold
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

  // Handle italic
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>")

  // Handle links
  text = text.replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2">$1</a>')

  // Handle lists
  text = text.replace(/^- (.*?)$/gm, "<li>$1</li>").replace(/<li>.*?<\/li>/gs, (match) => `<ul>${match}</ul>`)

  // Handle paragraphs
  text = text.replace(/^([^<].*?)$/gm, "<p>$1</p>")

  // Clean up empty paragraphs
  text = text.replace(/<p><\/p>/g, "")

  return text
}

