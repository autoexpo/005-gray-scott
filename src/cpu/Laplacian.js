/**
 * Laplacian stencils for the 2D finite-difference Gray-Scott simulation.
 *
 * The continuous Laplacian ∇²u = ∂²u/∂x² + ∂²u/∂y²
 * is approximated on a uniform grid with spacing h=1.
 *
 * 5-point stencil:
 *   ∇²u[i,j] ≈ u[i-1,j] + u[i+1,j] + u[i,j-1] + u[i,j+1] − 4·u[i,j]
 *
 * 9-point isotropic stencil (Patra & Karttunen, 2006):
 *   ∇²u[i,j] ≈ (1/6)(cardinal) + (1/12)(diagonal) − (5/6)center
 *
 * Periodic boundary conditions are handled by the grid's idx() method.
 */

/**
 * 5-point Laplacian for a single cell (r, c).
 * @param {Float32Array} arr - flat array
 * @param {Grid} grid
 * @param {number} r - row
 * @param {number} c - col
 * @returns {number}
 */
export function lap5(arr, grid, r, c) {
  return arr[grid.idx(r-1, c)] +
         arr[grid.idx(r+1, c)] +
         arr[grid.idx(r, c-1)] +
         arr[grid.idx(r, c+1)] -
         4.0 * arr[grid.idx(r, c)]
}

/**
 * 9-point isotropic Laplacian for a single cell (r, c).
 */
export function lap9(arr, grid, r, c) {
  const card = arr[grid.idx(r-1, c)] +
               arr[grid.idx(r+1, c)] +
               arr[grid.idx(r, c-1)] +
               arr[grid.idx(r, c+1)]
  const diag = arr[grid.idx(r-1, c-1)] +
               arr[grid.idx(r-1, c+1)] +
               arr[grid.idx(r+1, c-1)] +
               arr[grid.idx(r+1, c+1)]
  const center = arr[grid.idx(r, c)]
  return (1/6) * card + (1/12) * diag - (5/6) * center
}

/**
 * Compute Laplacian for entire grid into output array.
 * @param {Float32Array} arr - input
 * @param {Float32Array} out - output (pre-allocated)
 * @param {Grid} grid
 * @param {'5pt'|'9pt'} mode
 */
export function computeLaplacian(arr, out, grid, mode = '5pt') {
  const fn = mode === '9pt' ? lap9 : lap5
  for (let r = 0; r < grid.height; r++) {
    for (let c = 0; c < grid.width; c++) {
      out[grid.idx(r, c)] = fn(arr, grid, r, c)
    }
  }
}
