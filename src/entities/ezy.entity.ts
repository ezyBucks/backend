import { BaseEntity } from 'typeorm';

export class EzyEntity extends BaseEntity {
    public fieldReflector(): object {
        if (this.nonResponseFields().length === 0) {
            return this;
        }

        const response = {};

        Object.keys(this).forEach(key => {
            const value = (this as any)[key];

            if (!this.nonResponseFields().includes(key)) {
                (response as any)[key] = value;
            }
        });

        return response;
    }

    protected nonResponseFields(): string[] {
        return [];
    }
}
