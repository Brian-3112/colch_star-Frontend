import PropTypes from "prop-types";
import HeaderModals from "../chared/HeaderModals";
import { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import "../prendas/IconCss/style.Icon.css";
import "../compras/Css/carousel-styles.css";

export const DetalleCompras = ({ detallesCompras }) => {
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    setDetalles(detallesCompras.detalles || []);
  }, [detallesCompras]);

  return (
      <div>
          <div className='modal' id='modalDetalleCompra'>
              <div className='modal-dialog modal-dialog-centered '>
                  <div className='modal-content'>
                      <HeaderModals title={'Detalles compra'} />
                      <div>
                          <div className='modal-body '>
                              <form
                                  action=''
                                  id='formularioagregarCompra'
                                  className='row g-3 needs-validation'
                              >
                                  <Carousel>
                                      {detalles.map((detalle, index) => (
                                          <Carousel.Item
                                              key={detalle.id_detalle_compra}
                                          >
                                              <div className='col-md-12 mb-3'>
                                                  <label
                                                      htmlFor='producto'
                                                      className='col-form-label'
                                                  >
                                                      Proveedor
                                                  </label>
                                                  <input
                                                      type='text'
                                                      className='form-control'
                                                      value={
                                                          detallesCompras.proveedor
                                                              ? detallesCompras
                                                                    .proveedor
                                                                    .nombre ||
                                                                ''
                                                              : ''
                                                      }
                                                      readOnly
                                                  />
                                              </div>
                                              <div className='row'>
                                                  <div className='col-md-6 mb-3'>
                                                      <label
                                                          htmlFor='cantidad'
                                                          className='col-form-label'
                                                      >
                                                          Total de la compra:
                                                      </label>
                                                      <input
                                                          type='text'
                                                          className='form-control'
                                                          value={
                                                              detallesCompras.total_de_compra
                                                                  ? detallesCompras.total_de_compra ||
                                                                    ''
                                                                  : ''
                                                          }
                                                          readOnly
                                                      />
                                                  </div>
                                                  <div className='col-md-6 mb-3'>
                                                      <label
                                                          htmlFor='nombre'
                                                          className='col-form-label'
                                                      >
                                                          Fecha de la compra:
                                                      </label>
                                                      <input
                                                          type='text'
                                                          className='form-control'
                                                          value={
                                                              detallesCompras.fecha
                                                                  ? detallesCompras.fecha ||
                                                                    ''
                                                                  : ''
                                                          }
                                                          readOnly
                                                      />
                                                  </div>
                                              </div>
                                              <div className='row'>
                                                  <p className='text-center mt-4'>
                                                      Detalle #{index + 1}
                                                  </p>
                                                  <div className='col-md-12 '>
                                                      <label
                                                          htmlFor='producto'
                                                          className='col-form-label'
                                                      >
                                                          Producto Comprado:
                                                      </label>
                                                      <input
                                                          type='text'
                                                          className='form-control'
                                                          value={
                                                              detalle.prenda
                                                                  ?.nombre ||
                                                              'Impresión de estampados'
                                                          }
                                                          readOnly
                                                      />
                                                  </div>
                                                  <div className='col-md-6 '>
                                                      <label
                                                          htmlFor='cantidad'
                                                          className='col-form-label'
                                                      >
                                                          Cantidad:
                                                      </label>
                                                      <input
                                                          type='text'
                                                          className='form-control'
                                                          value={
                                                              detalle.cantidad
                                                          }
                                                          readOnly
                                                      />
                                                  </div>
                                                  <div className='col-md-6 '>
                                                      <label
                                                          htmlFor='nombre'
                                                          className='col-form-label'
                                                      >
                                                          Precio:
                                                      </label>
                                                      <input
                                                          type='text'
                                                          className='form-control'
                                                          value={detalle.precio}
                                                          readOnly
                                                      />
                                                  </div>
                                                  <div className='col-md-12 '>
                                                      <label
                                                          htmlFor='nombre'
                                                          className='col-form-label'
                                                      >
                                                          Total Del Detalle:
                                                      </label>
                                                      <input
                                                          type='text'
                                                          className='form-control'
                                                          value={
                                                              detalle.precio *
                                                              detalle.cantidad
                                                          }
                                                          readOnly
                                                      />
                                                  </div>
                                              </div>
                                          </Carousel.Item>
                                      ))}
                                  </Carousel>

                                  {/* Resto del formulario... */}
                              </form>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};

DetalleCompras.propTypes = {
  detallesCompras: PropTypes.object.isRequired,
};