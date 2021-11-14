/**
 * Log anything with timestamp.
 * 
 * @param  {...any} data 
 */
export function log(...data) {
  console.log(new Date, ...data)
}