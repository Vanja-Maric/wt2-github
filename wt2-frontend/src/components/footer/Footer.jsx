/** @jsxImportSource @emotion/react */
import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { FooterCss } from './Footer.css.jsx'

export function Footer() {
  return (
    <div css={FooterCss}>
      <footer className="footer py-3 custom-footer">
        <div className="container d-flex justify-content-around">
        <a href="https://www.linkedin.com/in/vanja-maric-98738b280/" className="text-decoration-none text-reset">
          Copyright &copy; 2024 Serz
        </a>
        </div>
      </footer>
    </div>
  )
}
