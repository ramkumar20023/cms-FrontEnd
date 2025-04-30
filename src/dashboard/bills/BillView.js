import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";

const BillView = () => {
  const { billId } = useParams();
  const [bill, setBill] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const printRef = useRef();

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [billRes, appointmentRes, doctorRes, patientRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/bills/${billId}/`, { headers }),
          axios.get("http://localhost:8000/api/appointments/", { headers }),
          axios.get("http://localhost:8000/api/doctors/", { headers }),
          axios.get("http://localhost:8000/api/patients/", { headers }),
        ]);

        setBill(billRes.data);
        setAppointments(appointmentRes.data);
        setDoctors(doctorRes.data);
        setPatients(patientRes.data);
      } catch (err) {
        console.error("Error fetching bill details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [billId]);

  const getAppointmentDetails = (id) =>
    appointments.find((a) => Number(a.AppointmentId) === Number(id));

  const getDoctorName = (appointmentId) => {
    const appointment = getAppointmentDetails(appointmentId);
    const doctor = doctors.find((d) => Number(d.DoctorId) === Number(appointment?.Doctor));
    return doctor ? `${doctor.FirstName} ${doctor.LastName}` : "Unknown Doctor";
  };

  const getPatientName = (appointmentId) => {
    const appointment = getAppointmentDetails(appointmentId);
    const patient = patients.find((p) => Number(p.id) === Number(appointment?.Patient));
    return patient ? patient.full_name : "Unknown Patient";
  };

  const downloadPDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    doc.html(printRef.current, {
      callback: () => {
        doc.save(`bill_${bill.BillId}.pdf`);
      },
      margin: [40, 40, 40, 40],
      autoPaging: true,
      x: 0,
      y: 0,
      html2canvas: { scale: 0.7 },
    });
  };

  const printBill = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Invoice</title>
          <style>
            body { font-family: 'Arial'; padding: 40px; }
            .invoice-container { max-width: 700px; margin: auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h2 { margin: 0; color: #0d6efd; }
            .info, .footer { margin-top: 20px; font-size: 14px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th, .table td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            .table th { background-color: #f0f0f0; }
            .footer { text-align: center; margin-top: 40px; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="invoice-container">
            ${printContent}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading || !bill) {
    return <div className="text-center mt-5">Loading bill details...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <div ref={printRef}>
          <div className="header text-center">
            <h2>KIMS Multispecialty Hospital</h2>
            <p>123 Health Street, City</p>
            <p>Phone: 9876543210 | Email: contact@kims.com</p>
            <hr />
            <h4>INVOICE</h4>
          </div>

          <div className="info">
            <p><strong>Bill ID:</strong> {bill.BillId}</p>
            <p><strong>Date:</strong> {new Date(bill.CreatedAt).toLocaleString()}</p>
            <p><strong>Appointment Token:</strong> {bill.Token}</p>
            <p><strong>Patient:</strong> {getPatientName(bill.Appointment)}</p>
            <p><strong>Doctor:</strong> {getDoctorName(bill.Appointment)}</p>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Cost (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Consultation</td>
                <td>100</td>
              </tr>
              {/* Add more items dynamically if needed */}
              <tr>
                <td colSpan="2" style={{ textAlign: 'right' }}><strong>Total:</strong></td>
                <td><strong>₹{bill.TotalCost}</strong></td>
              </tr>
            </tbody>
          </table>

          <div className="footer">
            <p>Thank you for visiting KIMS Hospital.</p>
            <p>For queries, call: 9876543210</p>
          </div>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-outline-primary me-2" onClick={downloadPDF}>
            Download PDF
          </button>
          <button className="btn btn-outline-success" onClick={printBill}>
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillView;
