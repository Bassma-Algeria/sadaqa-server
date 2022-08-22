import { EmailTemplate } from './EmailTemplate';
import { AssociationApprovalEmailTemplateBuilder } from './AssociationApprovalEmailTemplateBuilder';

class AssociationApprovalEmailTemplate implements EmailTemplate {
    static aBuilder() {
        return new AssociationApprovalEmailTemplateBuilder();
    }

    constructor(
        private readonly email: string,
        private readonly accountId: string,
        private readonly phoneNumber: string,
        private readonly wilayaNumber: number,
        private readonly associationName: string,
    ) {}

    buildTemplate(): string {
        return `
            <div style='font-family: sans-serif; padding: 50px;'>
                <h1 style='margin-bottom: 20px;'>New Association just signup to sadaqa :</h1>
                    <form >
                        <div>
                          <h3>Name : </h3><p>            ${this.associationName}</p>
                        </div>
                        <div>
                          <h3>Id : </h3> <p>             ${this.accountId}</p>
                        </div>
                        <div>
                          <h3>Wilaya : </h3><p>          ${this.wilayaNumber}</p>
                        </div>
                        <div>
                          <h3>Email : </h3><p>           ${this.email}</p>
                        </div>
                        <div>
                          <h3>Phone Number : </h3><p>    ${this.phoneNumber}</p>
                        </div>
                  </form>
            </div>
        `;
    }
}

export { AssociationApprovalEmailTemplate };
