import { AssociationApprovalEmailTemplate } from './AssociationApprovalEmailTemplate';

class AssociationApprovalEmailTemplateBuilder {
    private email!: string;
    private accountId!: string;
    private phoneNumber!: string;
    private wilayaNumber!: number;
    private associationName!: string;

    withEmail(email: string) {
        this.email = email;
        return this;
    }

    withId(accountId: string) {
        this.accountId = accountId;
        return this;
    }

    withPhoneNumber(phone: string) {
        this.phoneNumber = phone;
        return this;
    }

    withWilayaNumber(wilayaNumber: number) {
        this.wilayaNumber = wilayaNumber;
        return this;
    }

    withAssociationName(name: string) {
        this.associationName = name;
        return this;
    }

    build() {
        return new AssociationApprovalEmailTemplate(
            this.email,
            this.accountId,
            this.phoneNumber,
            this.wilayaNumber,
            this.associationName,
        );
    }
}

export { AssociationApprovalEmailTemplateBuilder };
