import { UserModel } from '../database/models/User';
import { PlaybookModel } from '../database/models/Playbook';

export async function getUsers() {
  try {
    return UserModel.findAll();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function getPlaybooks() {
  try {
    return PlaybookModel.findAll();
  } catch (error) {
    console.error('Error fetching playbooks:', error);
    throw error;
  }
}