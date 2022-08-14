import Image from 'next/image'
import React from 'react'
import { formatearDinero } from '../helpers';
import useQuiosco from '../hooks/useQuiosco';


const Producto = ({producto}) => {
  const {handleSetProducto, handleChangeModal, modal} = useQuiosco();
  const {nombre, imagen, precio} = producto;
  return (
    <div className='border p-3'>
      <Image src={`/assets/img/${imagen}.jpg`} alt={`Imagen Platillo ${nombre}`} width={400} height={500}/>
      <div className='p-5'>
        <h3 className='text-2xl font-bold'>{nombre}</h3>
        <p className='mt-5 font-black text-4xl text-amber-500'>
{formatearDinero(precio)}
        </p>
        <button
          type='button'
          className='bg-indigo-600 hover:bg-indigo-800 text-white font-bold p-3 mt-5 uppercase w-full'
          onClick={() => {handleSetProducto(producto)
            handleChangeModal()
            handleSetProducto(producto)
          }}
        >Agregar

        </button>
      </div>
    </div>
  )
}

export default Producto
