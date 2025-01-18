import React from 'react'
import Image from 'next/image'

import githubLogo from '@/assets/icons/github.svg'

const Footer = () => {
  return (
    <footer>
        <a href="https://www.github.com/davitboo">
            <Image src={githubLogo} alt="github logo"></Image>
        </a>
    </footer>
  )
}

export default Footer