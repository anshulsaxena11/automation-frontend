import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableCell,
  TableRow,
  ImageRun,
} from "docx";
import { saveAs } from "file-saver";

// Helper to safely return string or fallback
const safeText = (text) => (text ? String(text) : "—");

// Helper to fetch image as Uint8Array
const fetchImageAsUint8Array = async (url) => {
  try {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );
    if (!blob) throw new Error("Failed to convert image to blob");

    const arrayBuffer = await blob.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (err) {
    console.warn("Image fetch failed:", url, err);
    return null;
  }
};

const MSWordPreview = ({ fullReport }) => {
  const [showPreview, setShowPreview] = useState(false);

  const generateDocument = async () => {
    try {
      const sections = [];

      for (const [index, item] of fullReport.entries()) {
        const children = [];

        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Vulnerability No ${index + 1}`,
                bold: true,
                size: 28,
              }),
            ],
            spacing: { after: 300 },
          })
        );

        const rows = [
          ["Vulnerability Name/Type", safeText(item.vulnerabilityName)],
          ["Severity", safeText(item.sevirty)],
          ["Description", safeText(item.description)],
          ["Path", safeText(item.path)],
          ["Vulnerable Parameter", safeText(item.vulnerableParameter)],
          ["References", safeText(item.references)],
        ].map(([title, value]) =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(title)] }),
              new TableCell({ children: [new Paragraph(value)] }),
            ],
          })
        );

        if (Array.isArray(item.proofOfConcept) && item.proofOfConcept.length > 0) {
          const proofParagraphs = [];

          for (const proof of item.proofOfConcept) {
            if (proof.description) {
              proofParagraphs.push(
                new Paragraph({
                  children: [new TextRun(proof.description)],
                  spacing: { after: 200 },
                })
              );
            }

            if (proof.proof) {
              const imageData = await fetchImageAsUint8Array(proof.proof);
              if (imageData && imageData.length > 0) {
                proofParagraphs.push(
                  new Paragraph({
                    children: [
                      new ImageRun({
                        data: imageData,
                        transformation: {
                          width: 500,
                          height: 250,
                        },
                      }),
                    ],
                    spacing: { after: 300 },
                  })
                );
              } else {
                proofParagraphs.push(
                  new Paragraph("⚠️ Image could not be loaded.")
                );
              }
            }
          }

          rows.push(
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph("Proof of Concept")],
                }),
                new TableCell({ children: proofParagraphs }),
              ],
            })
          );
        }

        children.push(new Table({ rows }));
        children.push(new Paragraph({ text: "", spacing: { after: 400 } }));

        sections.push(children);
      }

      const doc = new Document({
        creator: "Sayujnet",
        title: "Project Report",
        description: "Generated vulnerability report",
        sections: [
          {
            properties: {},
            children: sections.flat(),
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, "Project_Report.docx");
    } catch (error) {
      console.error("Document generation failed:", error);
      alert("Failed to generate Word document. Please check the data and try again.");
    }
  };

  return (
    <>
      <Button variant="info" onClick={() => setShowPreview(true)}>
        Preview MS Word Report
      </Button>
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>MS Word Report Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {fullReport.map((item, index) => (
            <div key={index}>
              <h5>Vulnerability No {index + 1}</h5>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td><strong>Vulnerability Name/Type</strong></td>
                    <td>{item.vulnerabilityName}</td>
                  </tr>
                  <tr>
                    <td><strong>Severity</strong></td>
                    <td>{item.sevirty}</td>
                  </tr>
                  <tr>
                    <td><strong>Description</strong></td>
                    <td>{item.description}</td>
                  </tr>
                  <tr>
                    <td><strong>Path</strong></td>
                    <td>{item.path}</td>
                  </tr>
                  <tr>
                    <td><strong>Vulnerable Parameter</strong></td>
                    <td>{item.vulnerableParameter}</td>
                  </tr>
                  <tr>
                    <td><strong>References</strong></td>
                    <td>{item.references}</td>
                  </tr>
                  {Array.isArray(item.proofOfConcept) &&
                    item.proofOfConcept.length > 0 && (
                      <tr>
                        <td><strong>Proof of Concept</strong></td>
                        <td>
                          {item.proofOfConcept.map((proof, idx) => (
                            <div key={idx}>
                              {proof.description && <p>{proof.description}</p>}
                              {proof.proof && (
                                <img
                                  src={proof.proof}
                                  alt="Proof"
                                  style={{ width: "100%", height: "auto" }}
                                />
                              )}
                            </div>
                          ))}
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
              <hr />
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={generateDocument}>
            Download Report
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MSWordPreview;
