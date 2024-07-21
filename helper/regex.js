export const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/;
export const nameRegex = /^(?=.{1,50}$)[a-zA-Z]+([ '-][a-zA-Z]+)*$/;
export const regexStrongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,20}$/
//export const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const regexEmail = /^(?=.{1,64}@.{1,253}$)(?=[A-Z0-9._%+-]{1,64}@[A-Z0-9.-]{1,253}\.[A-Z]{2,}$)[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const numberRegex = /^\d*$/;


