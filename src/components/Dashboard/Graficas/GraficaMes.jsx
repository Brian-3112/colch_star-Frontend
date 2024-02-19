import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import BtnPDF from '../BtnPDF';
import PDFVentasMes from '../PDF/PDFVentasMes';

export const Grafica = ({ ordenes, compras }) => {
  const monthChartContainer = useRef(null);
  const monthChartInstance = useRef(null);
  const [monthStartDate, setMonthStartDate] = useState(null);
  const [monthEndDate, setMonthEndDate] = useState(null);

  useEffect(() => {
    const today = new Date();
    setMonthStartDate(startOfMonth(today));
    setMonthEndDate(endOfMonth(today));
  }, []);

  useEffect(() => {
    const createChart = async () => {
      try {
        if (monthChartInstance.current) {
          monthChartInstance.current.destroy();
        }

        if (monthStartDate && monthEndDate && compras && ordenes) {
          const daysInMonth = [];
          const currentDate = monthStartDate;

          while (currentDate <= monthEndDate) {
            daysInMonth.push(format(currentDate, 'yyyy-MM-dd'));
            currentDate.setDate(currentDate.getDate() + 1);
          }

          const ventasData = obtenerDatosVentasParaGrafico(daysInMonth, ordenes);
          const comprasData = obtenerDatosComprasParaGrafico(daysInMonth, compras);

          const ctx = monthChartContainer.current.getContext('2d');
          monthChartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: daysInMonth,
              datasets: [{
                label: 'Ventas',
                data: ventasData,
                backgroundColor: '#47684E',
                borderColor: '#47684E',
                borderWidth: 1
              },
              {
                label: 'Compras',
                data: comprasData,
                backgroundColor: '#1D1B31',
                borderColor: '#1D1B31',
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
        }
      } catch (error) {
        console.error('Error al crear la gráfica:', error);
      }
    };

    createChart();
  }, [monthStartDate, monthEndDate, compras, ordenes]);

  const obtenerDatosVentasParaGrafico = (fechas, ordenes) => {
    const datosAgrupados = ordenes.reduce((resultado, orden) => {
      const fecha = orden.fecha_creacion;

      if (!resultado[fecha]) {
        resultado[fecha] = 0;
      }

      if (orden.estado_de_orden === 'Creada') {
        resultado[fecha] += orden.precio_total;
      }

      return resultado;
    }, {});

    return fechas.map(fecha => {
      const totalVentas = datosAgrupados[fecha] || 0;
      return totalVentas;
    });
  };

  const obtenerDatosComprasParaGrafico = (fechas, compras) => {
    const datosAgrupados = compras.reduce((resultado, compra) => {
      const fecha = compra.fecha;

      if (!resultado[fecha]) {
        resultado[fecha] = 0;
      }

      resultado[fecha] += compra.total_de_compra;

      return resultado;
    }, {});

    return fechas.map(fecha => {
      const totalCompras = datosAgrupados[fecha] || 0;
      return totalCompras;
    });
  };

  return (
    <>    
      <div>
        <h2>Mes actual <BtnPDF namePDf={'mes.pdf'} componente={<PDFVentasMes/>}/></h2>
        <canvas ref={monthChartContainer} width="400" height="200"></canvas>
      </div>
    </>
  );
}

export default Grafica;
