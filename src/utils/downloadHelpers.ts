export const downloadCSV = async (
  type: "applications" | "digitizations",
  exportFunction: () => Promise<Blob>
): Promise<void> => {
  try {
    const blob = await exportFunction();

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${type}-export-${
      new Date().toISOString().split("T")[0]
    }.csv`;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("CSV download failed:", error);
    throw new Error("Failed to download CSV file");
  }
};

export const downloadFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
