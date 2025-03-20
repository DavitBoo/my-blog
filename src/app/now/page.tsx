import Image from 'next/image'
import React from 'react'
import styles from './now.module.css'
import { FaRegCalendarAlt } from 'react-icons/fa';

const lastUpdated = "10 de marzo de 2025"

const now = () => {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container`}>
          <h1>Bienvenido a mi now page</h1>
          <p className="lead">Esto es lo que estoy haciendo en este momento de mi vida</p>
          <p> <FaRegCalendarAlt />Última actualización: {lastUpdated}</p>
        </div>
      </section>

      <div className={styles.container}>
        <section>
          <div className={styles.whatIsNow}>
            <div>
              <h2 className='mb-4'>¿Qué es una "Now Page"?</h2>
              <p>
                Una "Now Page" es una página que muestra en qué estoy enfocado actualmente en mi vida. No es un listado
                exhaustivo de todo lo que hago, sino más bien un resumen de las cosas más importantes en las que estoy
                trabajando y pensando en este momento. Concepto popularizado por{" "}
                <a
                  href="https://nownownow.com/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Derek Sivers
                </a>
                .
              </p>
            </div>
          </div>
        </section>
        <section className="where">
          <div>
            <h2 className='mb-4'>¿Dónde estoy?</h2>
            <p>Estoy en Vitoria.</p>
            <p>Llevo aquí los últimos casi 3 años, hace casi dos encontré un trabajo como desarrollador en una empresa de márketing y me he acomodado ligeramente. De momento sigo mirando con nostalgia mis viajes y mi corto periodo vivido en Atenas.</p>
            <p>Desde que volví aquí he vuelto a Grecia, estuve en Islandia y he aprovechado para subir todos los montes de la zona que he podido hasta ahora.</p>
          </div>
        </section>
        <section className="what">
          <div>
            <h2 className='mb-4'>¿Qué estoy haciendo?</h2>
            <p>Sigo tocando la guitarra, aunque menos de lo que me gustaría, últimamente la eléctrica.</p>
            <p>Aunque sigo practicando griego siempre que puedo y me estoy viendo la serie <em>Maestro</em>, en este momento estoy aprendiendo portugués.</p>
            <p>Estoy trabajando en esta web, aplicando lo que voy aprendiendo de node, express, react y next. Además estoy probando cosillas con Python.</p>
            <p>La calistenia forma parte de mi vida como desde hace unos largos años ya, tengo pendiente el muscle up en anillas y un pino solido para este año. Además estoy yendo al monte todo lo que puedo.</p>
            <p>Estoy leyendo libros de desarollo personal, salud y psicología para seguir entendiendome y aprendiendo cosas de mi y de mi entorno, para ayudarme y ayudar a los demás.</p>
          </div>
        </section>
        <section className="projects mb-8">
          <div>
            <h2 className='mb-4'>Mis proyectos</h2>
            <p>Además de lo anterior suelo tener algún proyecto en marcha que me suele consumir más tiempo que los demás:</p>
            <div className={`customCard ${styles.projectCard}`}>
              <h2 className="mb-4">Mis guitarras</h2>
              <p>
                En enero de 2023 empecé con un proyecto que incluía 5 guitarra eléctricas. Una quedó en pausa indefinida, pero he seguido con las otras 4 y están casi listas.
              </p>
              <progress value="90" max="100"></progress>
              <p>Progreso: 90%</p>
            </div>
          </div>
        </section>
        <section className="my-plans">
          <div>
            <h2 className='mb-4'>¿Qué planes tengo?</h2>
            <p>Terminar mis guitarras, ordenar las fotos y compartilas, con intención quizás de encontrar dueño para alguna de ellas. Aunque les tengo un cariño increible y no sé si seré capaz.</p>
            <p>Empezar a compartir los que voy aprendiendo y probando en el blog de esta web: mis pruebas con la madera, lecturas, viajes...</p>
            <p>Tengo pendiente aprender a hacer testing y a escribir un código un poco más ordenado en proyectos grandes, así que es probable que desarrolle algo más grande pronto para probar eso.</p>
            <p>Por supuesto, seguir entrenando, subiendo montes, tocando la guitarra, leyendo y aprendiendo idiomas.</p>
          </div>
        </section>
      </div>
    </>
  )
}

export default now