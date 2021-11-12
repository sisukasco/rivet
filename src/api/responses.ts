
export type ThankYouMessage={
    message:string,
    submission_id:string,
    type:string,
    display_style:string
}

export type RedirectURL={
    type:string,
    url:string,
    submission_id:string
}

export type PartialSubmissionAccepted={
    submission_id:string,
    type:string
}

export type ComputedPayment = {
    type:string,
    amount: number,
    processor:string,
    api_key:string,
    submission_id:string,
    checkout_id:string
}

export type SubmissionResponse=ThankYouMessage|RedirectURL|PartialSubmissionAccepted|ComputedPayment;
