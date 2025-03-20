import styles from './sobre-mi.module.css'
import React from 'react'

const Page = () => {
    return (
        <div className={styles.container}>
            <main className={styles.main}>  
                <h1 className={styles.title}>Próximamente</h1>
                <p className={styles.description}>
                    Esta sección está en construcción. ¡Vuelve pronto para conocer más sobre mí!
                </p>
                <div className={styles.icon}>🚧</div>
            </main>
        </div>
    )
}

export default Page