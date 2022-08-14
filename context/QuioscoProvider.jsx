import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState, createContext } from "react";
import { toast } from "react-toastify";

const QuioscoContext = createContext();

const QuioscoProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]);
  //defino en que categoria estoy
  const [categoriaActual, setCategoriaActual] = useState({});
  const [producto, setProducto] = useState({});
  const [modal, setModal] = useState(false);
  const [pedido, setPedido] = useState([]);
  const [total, setTotal] = useState(0);
  const [nombre, setNombre] = useState("");
  const router = useRouter();
  const obtenerCategorias = async () => {
    const { data } = await axios("/api/categorias");
    setCategorias(data);
  };
  useEffect(() => {
    obtenerCategorias();
  }, []);
  useEffect(() => {
    setCategoriaActual(categorias[0]);
  }, [categorias]);
  useEffect(() => {
    const nuevoTotal = pedido.reduce(
      (total, producto) => producto.precio * producto.cantidad + total,
      0
    );
    setTotal(nuevoTotal);
  }, [pedido]);
  const handleClickCategoria = (i) => {
    const categoria = categorias.filter((cat) => cat.id === i);
    setCategoriaActual(categoria[0]);
    router.push(`/`);
  };
  const handleSetProducto = (producto) => {
    setProducto(producto);
  };
  const handleChangeModal = () => {
    setModal(!modal);
  };
  const handleAgregarPedido = ({ categoriaId, ...producto }) => {
    if (pedido.some((productoState) => productoState.id === producto.id)) {
      //Actualizar la cantidad del producto
      const pedidoActualizado = pedido.map((productoState) =>
        productoState.id === producto.id ? producto : productoState
      );
      setPedido(pedidoActualizado);
      toast.success("Guardado correctamente");
    } else {
      setPedido([...pedido, producto]);
      toast.success("Agregado al pedido");
    }
    setModal(false);
  };
  const handleEditarCantidades = (id) => {
    const productoActualizar = pedido.filter((producto) => producto.id === id);
    setProducto(productoActualizar[0]);
    setModal(!modal);
  };
  const handleEliminarProducto = (id) => {
    const pedidoActualizado = pedido.filter((producto) => producto.id !== id);
    setPedido(pedidoActualizado);
  };
  const colocarOrden = async (e) => {
    e.preventDefault();
    try {
       await axios.get.post("/api/ordenes", {
        pedido,
        nombre,
        total,
        fecha: Date.now().toString(),
      });
      //resetear App
      setCategoriaActual(categorias[0]);
      setPedido([]);
      setTotal(0);
     setNombre("");
     toast.success('Pedido realizado correctamente')
     setTimeout(()=>{
        router.push('/')
     
     },3000);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <QuioscoContext.Provider
      value={{
        categorias,
        categoriaActual,
        handleClickCategoria,
        handleSetProducto,
        producto,
        handleChangeModal,
        modal,
        handleAgregarPedido,
        pedido,
        handleEditarCantidades,
        handleEliminarProducto,
        nombre,
        setNombre,
        total,
        setTotal,
        colocarOrden,
      }}
    >
      {children}
    </QuioscoContext.Provider>
  );
};

export { QuioscoProvider };
export default QuioscoContext;
