import React from 'react'
import Image from 'next/image'

import githubLogo from '@/assets/icons/github.svg'

const Footer = () => {
  return (
    <footer>
      <span>made by DavitBoo</span>
        <div className="socialContainer">
          <a href="https://www.github.com/davitboo">
              <Image src={githubLogo} alt="github logo"></Image>
          </a>
        </div>
    </footer>
  )
}

export default Footer