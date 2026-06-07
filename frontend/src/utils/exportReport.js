import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportDashboardReport = ({
  totalTickets,
  openTickets,
  criticalIssues,
  resolutionRate,
  recentActivities,
  topAgent,
}) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("SupportDesk Dashboard Report", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [["Metric", "Value"]],
    body: [
      ["Total Tickets", totalTickets],
      ["Open Tickets", openTickets],
      ["Critical Issues", criticalIssues],
      ["Resolution Rate", `${resolutionRate}%`],
    ],
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Recent Activities"]],
    body: recentActivities.map((activity) => [activity]),
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Top Agent", "Role"]],
    body: [[topAgent.name, topAgent.role]],
  });

  doc.save("SupportDesk_Report.pdf");
};