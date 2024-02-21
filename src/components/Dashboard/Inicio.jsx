import { Button, Card, Flex, Text, Title } from "@tremor/react";

import {
  FaPhoneAlt,
  FaTshirt,
  FaTruck,
  FaArrowAltCircleRight,
  FaArrowAltCircleLeft,
} from "react-icons/fa";

import { BiBox } from "react-icons/bi";

import { FaMoneyBillTrendUp } from "react-icons/fa6";

import { MdOutlineMoneyOffCsred } from "react-icons/md";
import { PiShootingStarThin } from "react-icons/pi";
import { IoAccessibility } from "react-icons/io5";
import { AiFillCrown } from "react-icons/ai";
import Header from "../chared/header/Header";
import "../Dashboard/Css/styleDashboard.css";
import useProveedor from "../../hooks/useProveedor";
import useClientes from "../../hooks/useCliente";
import usePrendas from "../../hooks/usePrendas";
import { useDisenosContext } from "../../context/disenosProvider";
import useProducto from "../../hooks/useProducto";
import { Link } from "react-router-dom";
import useMovimientos from "../../hooks/useMovimientos";
import { useEffect, useState } from "react";
import useCompras from "../../hooks/useCompras.jsx";
import useOrden from "../../hooks/useOrden.jsx";
import { Notificacion } from "./Notificacion.jsx";
import PDFOrdenSemanal from "./PDF/PDFOrdenSemanal.jsx";
import BtnPDF from "./BtnPDF.jsx";
import GraficaMes from "./Graficas/GraficaMes.jsx";
import GraficaPrendas from "./Graficas/GraficaPrendas.jsx";
import ComprasPrendas from "./Graficas/ComprasPrendas.jsx";
import PDFComprasSemana from "./PDF/PDFComprasSemana.jsx";
import { format, subDays, startOfToday, parseISO } from "date-fns";
import DetallesProducto from "../producto/DetallesProducto.jsx";
import { DetallesClientes } from "../cliente/DetallesClientes.jsx";
import { DetalleDiseno } from "../diseños/DetalleDiseno.jsx";

export const InicioDashboard = () => {
  const { proveedores } = useProveedor();
  const { clientes,consultarClientes } = useClientes();
  const { Prendas } = usePrendas();
  const { disenosDB } = useDisenosContext();
  const { productos, detailsDiseno } = useProducto();
  const { compras, detallesCompra } = useCompras();
  const { ordenes, detailsOrden } = useOrden();
  const { movimiento } = useMovimientos();

  const [detallesProductos, setDetallesProductos] = useState({});
  const [detallesClientes, setDetallesClientes] = useState({});
  const [detalleDiseno, setDetalleDiseno] = useState({});

  const cantidadDeProveedores = proveedores.length;
  const cantidadDeClientes = clientes.length;
  const cantidadDePrendas = Prendas.length;
  const cantidadDeDisenos = disenosDB.length;
  const cantidadDeProductos = productos.length;
  const ClienteEstrella = ordenes.map((star) => star.fk_cliente);
  const ProductoEstrella = detailsOrden.map(
    (starProducts) => starProducts.fk_producto
  );
  const DisenoEstrella = detailsDiseno.map(
    (starDiseno) => starDiseno.fk_diseno
  );

  const cantidadDeCompras = compras.map(
    (comprasEnTotal) => comprasEnTotal.total_de_compra
  );
  let cantidad = 0;

  for (let i = 0; i < cantidadDeCompras.length; i++) {
    cantidad += cantidadDeCompras[i];
  }

  const frecuenciaDeOrdenesEnLosClientes = {};
  let ClienteStar;
  let maxFrecuenciaCliente = 0;

  ClienteEstrella.forEach((repetidos) => {
    frecuenciaDeOrdenesEnLosClientes[repetidos] =
      (frecuenciaDeOrdenesEnLosClientes[repetidos] || 0) + 1;
  });

  for (const repetidos in frecuenciaDeOrdenesEnLosClientes) {
    if (frecuenciaDeOrdenesEnLosClientes[repetidos] > maxFrecuenciaCliente) {
      maxFrecuenciaCliente = frecuenciaDeOrdenesEnLosClientes[repetidos];
      ClienteStar = repetidos;
    }
  }

  const frecuenciaDeProductos = {};
  let ProductoStar;
  let maxFrecuenciaProducto = 0;

  ProductoEstrella.forEach((repetidos) => {
    frecuenciaDeProductos[repetidos] =
      (frecuenciaDeProductos[repetidos] || 0) + 1;
  });

  for (const repetidos in frecuenciaDeProductos) {
    if (frecuenciaDeProductos[repetidos] > maxFrecuenciaProducto) {
      maxFrecuenciaProducto = frecuenciaDeProductos[repetidos];
      ProductoStar = repetidos;
    }
  }

  const frecuenciaDeDiseno = {};
  let DisenoStar;
  let maxFrecuenciaDiseno = 0;

  DisenoEstrella.forEach((repetidos) => {
    frecuenciaDeDiseno[repetidos] = (frecuenciaDeDiseno[repetidos] || 0) + 1;
  });

  for (const repetidos in frecuenciaDeDiseno) {
    if (frecuenciaDeDiseno[repetidos] > maxFrecuenciaDiseno) {
      maxFrecuenciaDiseno = frecuenciaDeDiseno[repetidos];
      DisenoStar = repetidos;
    }
  }

  const modalDetalleProducto = productos.find(
    (productsElegido) => productsElegido.id_producto == ProductoStar
  );

  const modalDetalleClientes = clientes.find(
    (clienteElegido) => clienteElegido.id_cliente == ClienteStar
  )

  const modalDetalleDiseno = disenosDB.find(
    (disenoElegido) => disenoElegido.id_diseno == DisenoStar
  );

  const [totalComprasUltimosSieteDias, setTotalComprasUltimosSieteDias] =
    useState(0);
  const [
    totalComprasUltimosSieteDiasVentas,
    SetTotalComprasUltimosSieteDiasVentas,
  ] = useState(0);

  useEffect(() => {
    // Obtener la fecha de hoy
    const fechaActual = startOfToday();

    // Calcular la fecha de hace 7 días
    const fechaInicioSemanaActual = subDays(fechaActual, 7);

    // Filtrar compras de los últimos 7 días
    const comprasUltimos7Dias = compras.filter((compra) => {
      const fecha = parseISO(compra.fecha);
      return fecha >= fechaInicioSemanaActual && fecha <= fechaActual;
    });

    const VentasUltimosSieteDias = ordenes.filter((orden) => {
      const fecha = parseISO(orden.fecha_creacion);
      return (
        fecha >= fechaInicioSemanaActual &&
        fecha <= fechaActual &&
        orden.estado_de_orden === "Finalizada"
      );
    });
    const totalVentas = VentasUltimosSieteDias.reduce(
      (total, orden) => total + orden.precio_total,
      0
    );
    SetTotalComprasUltimosSieteDiasVentas(totalVentas);

    // Suma de todas las cantidades de las compras de los últimos 7 días
    const totalCompras = comprasUltimos7Dias.reduce(
      (total, compra) => total + compra.total_de_compra,
      0
    );
    setTotalComprasUltimosSieteDias(totalCompras);
  }, [compras]);

  return (
    <>
      <div className="contenedor">
        <div className="separador">
          <Header titulo="Dashboard" />

          <Notificacion />
        </div>

        <div className="cards">
          <div id="carouselExampleIndicators" className="carousel slide">
            <div className="carousel-indicators">
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="0"
                className="active"
                aria-current="true"
                aria-label="Slide 1"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="1"
                aria-label="Slide 2"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="2"
                aria-label="Slide 3"
              ></button>
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <Card className="CardPrincipal">
                  <div className="textDatosGenerales">
                    <Title>Datos económicos</Title>
                  </div>

                  <Flex>
                    <Card className="two">
                      <Title className="textCompras">Total de compras</Title>
                      <MdOutlineMoneyOffCsred className="iconsE" />
                      <Text className="Cantidad">
                        {totalComprasUltimosSieteDias.toLocaleString()}
                      </Text>

                      <BtnPDF
                        namePDf={"ComprasSemanal.pdf"}
                        componente={<PDFComprasSemana />}
                      />
                    </Card>

                    <Card className="two">
                      <Title className="textCompras">Total de ventas</Title>
                      <FaMoneyBillTrendUp className="iconsE" />

                      <Text className="Cantidad">
                        {totalComprasUltimosSieteDiasVentas.toLocaleString()}
                      </Text>

                      <BtnPDF
                        namePDf={"ventasSemanal.pdf"}
                        componente={<PDFOrdenSemanal />}
                      />
                    </Card>
                  </Flex>
                </Card>
              </div>
              <div class="carousel-item">
                <Card className="CardPrincipal">
                  <div className="textDatosGenerales">
                    <Title>Datos generales</Title>
                  </div>

                  <Flex>
                    <Card className="two">
                      <Title className="textProveedor">
                        Total de proveedores
                      </Title>
                      <FaPhoneAlt className="icons" />
                      <Text className="Cantidad">{cantidadDeProveedores}</Text>
                      <Button className="botonInfo">
                        <Link to={"/administracion/proveedores"}>
                          <span className="textBoton">Más Info</span>
                          <FaArrowAltCircleRight className="btnIcons" />
                        </Link>
                      </Button>
                    </Card>

                    <Card className="two">
                      <Title className="textGeneral">Total de clientes</Title>
                      <IoAccessibility className="icons" />
                      <Text className="Cantidad">{cantidadDeClientes}</Text>
                      <Button className="botonInfo">
                        <Link to={"/administracion/clientes"}>
                          <span className="textBoton">Más Info</span>
                          <FaArrowAltCircleRight className="btnIcons" />
                        </Link>
                      </Button>
                    </Card>

                    <Card className="two">
                      <Title className="textGeneral">Total de prendas</Title>
                      <FaTshirt className="icons" />
                      <Text className="Cantidad">{cantidadDePrendas}</Text>

                      <Button className="botonInfo">
                        <Link to={"/administracion/prendas"}>
                          <span className="textBoton">Más Info</span>
                          <FaArrowAltCircleRight className="btnIcons" />
                        </Link>
                      </Button>
                    </Card>

                    <Card className="two">
                      <Title className="textGeneral">Total de diseños</Title>
                      <AiFillCrown className="icons" />
                      <Text className="Cantidad">{cantidadDeDisenos}</Text>
                      <Button className="botonInfo">
                        <Link to={"/administracion/disenos"}>
                          <span className="textBoton">Más Info</span>
                          <FaArrowAltCircleRight className="btnIcons" />
                        </Link>
                      </Button>
                    </Card>

                    <Card className="two">
                      <Title className="textGeneral">Total de productos</Title>
                      <FaTruck className="icons" />
                      <Text className="Cantidad">{cantidadDeProductos}</Text>
                      <Button className="botonInfo">
                        <Link to={"/administracion/productos"}>
                          <span className="textBoton">Más Info</span>
                          <FaArrowAltCircleRight className="btnIcons" />
                        </Link>
                      </Button>
                    </Card>
                  </Flex>
                </Card>
              </div>
              <div className="carousel-item">
                <Card className="CardPrincipal">
                  <div className="textDatosGenerales">
                    <Title>Más frecuente</Title>
                  </div>

                  <Flex>
                    <Card className="two">
                      <Title className="textGeneralMas">Cliente Star</Title>
                      <PiShootingStarThin className="star" />

                      {clientes.map((clienteElegido) => (
                        <Text className="NombreStar">
                          {clienteElegido.id_cliente == ClienteStar ? (
                            <p>
                              {clienteElegido.nombre} {clienteElegido.apellido}{" "}
                            </p>
                          ) : (
                            ""
                          )}
                        </Text>
                      ))}

                      <Button
                        className="botonInfoF"
                        data-bs-toggle="modal"
                        data-bs-target="#modalDetalleCliente"
                        onClick={() =>
                          setDetallesClientes(modalDetalleClientes)
                        }
                      >
                        <span className="textBoton">Más Info</span>
                        <FaArrowAltCircleRight className="btnIcons" />
                      </Button>
                    </Card>

                    <Card className="two">
                      <Title className="textGeneralMas">Productos Star</Title>
                      <BiBox className="icons" />

                      {productos.map((productsElegido) => (
                        <Text className="NombreStar">
                          {productsElegido.id_producto == ProductoStar
                            ? productsElegido.nombre
                            : " "}
                        </Text>
                      ))}

                      <Button
                        className="botonInfoF"
                        data-bs-toggle="modal"
                        data-bs-target="#modalDetallesProductos"
                        onClick={() =>
                          setDetallesProductos(modalDetalleProducto)
                        }
                      >
                        <span className="textBoton">Más Info</span>
                        <FaArrowAltCircleRight className="btnIcons" />
                      </Button>
                    </Card>

                    <Card className="two">
                      <Title className="textGeneralMas">Diseños Star</Title>
                      <AiFillCrown className="icons" />

                      {disenosDB.map((disenoElegido) => (
                        <Text className="NombreStar">
                          {disenoElegido.id_diseno == DisenoStar
                            ? disenoElegido.nombre
                            : ""}
                        </Text>
                      ))}

                      <Button
                        className="botonInfoF"
                        data-bs-toggle="modal"
                        data-bs-target="#modalDetalles"
                        onClick={() => setDetalleDiseno(modalDetalleDiseno)}
                      >
                        <span className="textBoton">Más Info</span>
                        <FaArrowAltCircleRight className="btnIcons" />
                      </Button>
                    </Card>
                  </Flex>
                </Card>{" "}
              </div>
            </div>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="prev"
            >
              <span>
                {" "}
                <FaArrowAltCircleLeft className="iconsCarrusel" />
              </span>
            </button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="next"
            >
              <span>
                <FaArrowAltCircleRight className="iconsCarruselD" />
              </span>
            </button>
          </div>
        </div>

        <div className="cards">
          <Card className="cardsNavBar">
            <div>
              <Card className="textDatosGenerales">
                <Text className="textGrafica">Graficas</Text>
              </Card>
            </div>
          </Card>

          <Card className="containerHeaderTable">
            <GraficaMes ordenes={ordenes} compras={compras} />
          </Card>

          <Card className="containerHeaderTable">
            <GraficaPrendas Prendas={Prendas} />
          </Card>

          <Card className="containerHeaderTable">
            <ComprasPrendas
              detallesCompra={detallesCompra}
              compras={compras}
              Prendas={Prendas}
            />
          </Card>
        </div>
      </div>
      <DetallesProducto detallesProductos={detallesProductos} />
      <DetallesClientes detallesClientes={detallesClientes} />
      <DetalleDiseno detalleDiseno={detalleDiseno} />
    </>
  );
};

export default InicioDashboard;
