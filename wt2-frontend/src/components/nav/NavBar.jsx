/** @jsxImportSource @emotion/react */
import React from 'react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css'

import { NavBarCss } from './NavBar.css.jsx'

/**
 * Renders a navigation bar with links to different pages.
 *
 * @returns {JSX.Element} A navigation bar component.
 */
export function NavBar() {
  const [checkChecked, setChecked] = useState(false)

  /**
   * Handles the change event of the checkbox.
   */
  function handleChecked() {
    setChecked(!checkChecked)
  }

  return (
    <div css={NavBarCss}>
      <nav className="navbar navbar-expand-lg bg-light text-black custom-navbar px-4">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <a className="navbar-brand fs-5" href="/">
            New York Airbnb Prices
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link fs-5 ${isActive ? 'active' : ''}`
                  }
                  to="/"
                  onClick={handleChecked}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link fs-5 ${isActive ? 'active' : ''}`
                  }
                  to="/statistics"
                  onClick={handleChecked}
                >
                  Statistics
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}
