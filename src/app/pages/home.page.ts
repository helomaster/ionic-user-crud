import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
selector: 'app-home',
standalone: true,
imports: [CommonModule, IonicModule, ReactiveFormsModule],
templateUrl: './home.page.html',
styleUrls: ['./home.page.scss']
})
export class HomePage {
private fb = inject(FormBuilder);
private users = inject(UserService);
private toastCtrl = inject(ToastController);
form: FormGroup = this.fb.group({
name: ['', [Validators.required, Validators.minLength(3)]],
email: ['', [Validators.required, Validators.email]]
});
editingId = signal<string | null>(null);
get f() { return this.form.controls; }
users$ = this.users.users$;
async submit() {
if (this.form.invalid) {
this.form.markAllAsTouched();
this.presentToast('Preencha os campos corretamente.');
return;
}
const { name, email } = this.form.value as { name: string; email: string };
if (this.editingId()) {
this.users.update(this.editingId()!, { name, email });
this.presentToast('Usuário atualizado.');
this.cancelEdit();
} else {
this.users.add({ name, email });
this.presentToast('Usuário cadastrado.');
this.form.reset();
}
}
edit(u: User) {
this.editingId.set(u.id);
this.form.setValue({ name: u.name, email: u.email });
}

cancelEdit() {
this.editingId.set(null);
this.form.reset();
}
remove(id: string) {
this.users.remove(id);
this.presentToast('Usuário removido.');
}
private async presentToast(message: string) {
const t = await this.toastCtrl.create({ message, duration: 1500, position: 'bottom'
});
await t.present();
}
trackById(index: number, item: User) {
  return item.id;
}

}