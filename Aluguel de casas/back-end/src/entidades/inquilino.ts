 import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 
"typeorm";
 import Usuário from "./usuário";
 import ContratoLocação from "./contratolocação";
 export enum Tipo {UNIVERSITARIO = "universitário", NAO_UNIVERSITARIO = "não_universitário"};
 @Entity()
 export default class Inquilino extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "enum", enum: Tipo })
  tipo: Tipo;
  @Column({ default: 0 })
  tempo_alugando: number;
  @Column()
  fumante: boolean;
  @Column({nullable: true})
  profissão: string;
  @Column({nullable: true})
  descrição_pessoal: string;

  
  @OneToMany(() => ContratoLocação, (contrato) => contrato.inquilino)
  contratos: ContratoLocação[];
  @OneToOne(() => Usuário, (usuário) => usuário.inquilino, { onDelete: "CASCADE" })
  @JoinColumn()
   usuário: Usuário;
}