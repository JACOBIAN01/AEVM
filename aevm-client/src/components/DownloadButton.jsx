import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function DownloadButton({ candidates, votes }) {
  const handleDownload = (type) => {
    const data = candidates.map((c) => ({
      Name: c.name,
      Votes: votes[c.key],
    }));

    if (type === "excel") {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Votes");
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(blob, "votes.xlsx");
    }

    if (type === "pdf") {
      const doc = new jsPDF();
      doc.text("AEVM Voting Data", 14, 15);
      doc.autoTable({
        head: [["Name", "Votes"]],
        body: data.map((row) => [row.Name, row.Votes]),
        startY: 20,
      });
      doc.save("votes.pdf");
    }
  };

  return (
    <div className="flex gap-2 justify-center mt-4">
      <button
        onClick={() => handleDownload("excel")}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Download Excel
      </button>
      <button
        onClick={() => handleDownload("pdf")}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Download PDF
      </button>
    </div>
  );
}
