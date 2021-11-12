//TODO: import Validation declarations from boel
type SimpleValidation={
    condition?: undefined,
    message?: undefined,
    [k:string]: string | number | boolean | Date | undefined  
}

type ValidationMap={
    [v:string]:SimpleValidation
}

export type Field={
    name: string,
    type: string,
    validations: ValidationMap,
}
    
export type FormSettings = {
    token:string,
    loader_token?:string
    override_validation_handling?:boolean
    fields: Field[],
    payment_processor?:string,
    payment_api_key?: string
}

