// This is an enhanced PDF export function
// In a real application, you would use a library like jsPDF or pdfmake for better formatting

export const exportToPDF = (resume) => {
    // Create a hidden element with the resume content in LaTeX-style formatting
    const element = document.createElement("div")
    element.innerHTML = `
      <div class="latex-document">
        <h1 class="latex-title">${resume.name}</h1>
        ${resume.title ? `<h2 class="latex-subtitle">${resume.title}</h2>` : ""}
        
        ${
          resume.contact
            ? `<div class="latex-section">
          <h3 class="latex-section-title">Contact</h3>
          <div class="latex-content">${resume.contact.replace(/\n/g, "<br>")}</div>
        </div>`
            : ""
        }
        
        ${
          resume.bio
            ? `<div class="latex-section">
          <h3 class="latex-section-title">Professional Summary</h3>
          <div class="latex-content">${resume.bio.replace(/\n/g, "<br>")}</div>
        </div>`
            : ""
        }
        
        ${
          resume.experience
            ? `<div class="latex-section">
          <h3 class="latex-section-title">Experience</h3>
          <div class="latex-content">${resume.experience.replace(/\n/g, "<br>")}</div>
        </div>`
            : ""
        }
        
        ${
          resume.education
            ? `<div class="latex-section">
          <h3 class="latex-section-title">Education</h3>
          <div class="latex-content">${resume.education.replace(/\n/g, "<br>")}</div>
        </div>`
            : ""
        }
        
        ${
          resume.skills
            ? `<div class="latex-section">
          <h3 class="latex-section-title">Skills</h3>
          <div class="latex-content">${resume.skills}</div>
        </div>`
            : ""
        }
        
        ${
          resume.projects
            ? `<div class="latex-section">
          <h3 class="latex-section-title">Projects</h3>
          <div class="latex-content">${resume.projects.replace(/\n/g, "<br>")}</div>
        </div>`
            : ""
        }
      </div>
    `
  
    // Apply LaTeX-inspired styling
    const style = document.createElement("style")
    style.textContent = `
      @page {
        size: A4;
        margin: 2cm;
      }
      .latex-document {
        font-family: "Computer Modern", "Latin Modern Roman", "Latin Modern Math", Georgia, serif;
        line-height: 1.5;
        max-width: 800px;
        margin: 0 auto;
        padding: 2cm;
        color: #333;
        background-color: white;
      }
      .latex-title {
        font-size: 24pt;
        text-align: center;
        font-weight: normal;
        margin-bottom: 0.5cm;
        color: #2563eb;
      }
      .latex-subtitle {
        font-size: 14pt;
        text-align: center;
        font-weight: normal;
        margin-top: 0;
        margin-bottom: 1cm;
        color: #4b5563;
      }
      .latex-section {
        margin-bottom: 1cm;
      }
      .latex-section-title {
        font-size: 14pt;
        font-weight: normal;
        border-bottom: 1px solid #2563eb;
        padding-bottom: 0.2cm;
        margin-bottom: 0.3cm;
        color: #2563eb;
      }
      .latex-content {
        margin-left: 0.5cm;
      }
      .latex-content p {
        margin-bottom: 0.5cm;
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: "Computer Modern", "Latin Modern Roman", serif;
      }
    `
    element.appendChild(style)
  
    document.body.appendChild(element)
  
    // Use browser's print functionality to save as PDF
    window.print()
  
    // Remove the element after printing
    document.body.removeChild(element)
  }
  
  