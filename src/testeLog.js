import React from 'react';
import ExcelJS from 'exceljs';

const ExportToExcel = ({ data, fileName }) => {
    const exportExcel = async () => {
      // 1. Create a new workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Data Report');
  
      // 2. Define the table headers
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Join Date', key: 'joinDate', width: 20 },
      ];
  
      // 3. Insert data into the worksheet
      data.forEach((item) => {
        worksheet.addRow({
          id: item.id,
          name: item.name,
          email: item.email,
          joinDate: item.joinDate,
        });
      });
  
      // 4. Style the header
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center' };
      });
  
      // 5. Save the workbook as an Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${fileName}.xlsx`);
    };
  
    return (
      <button onClick={exportExcel}>Download Excel</button>
    );
  };
  
  export default ExportToExcel;