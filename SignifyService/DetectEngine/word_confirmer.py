import numpy as np

class wordConfirmer:
    def __init__(self) -> None:
        self.on = 1

    def confirm(self, word, keys_pose, keys_hand):
        if word == 'do':
            return self.confirm_do(keys_pose, keys_hand)
        if word == 'eat':
            return self.confirm_eat(keys_pose, keys_hand)
        if word == 'hamburger':
            return self.confirm_hamburger(keys_pose, keys_hand)
        if word == 'i love you':
            return self.confirm_iloveyou(keys_pose, keys_hand)
        if word == 'i':
            return self.confirm_i(keys_pose, keys_hand)
        if word == 'no':
            return self.confirm_no(keys_pose, keys_hand)
        if word == 'to':
            return self.confirm_to(keys_pose, keys_hand)
        if word == 'want':
            return self.confirm_want(keys_pose, keys_hand)
        if word == 'yes':
            return self.confirm_yes(keys_pose, keys_hand)
        if word == 'you':
            return self.confirm_you(keys_pose, keys_hand)
        if word == '!':
            return True

    #TODO: add conds
    def confirm_do(self, keys_pose, keys_hand):
        return 'do'

    def confirm_eat(self, keys_pose, keys_hand):
        return 'eat'

    def confirm_hamburger(self, keys_pose, keys_hand):
        return 'hamburger'

    def confirm_iloveyou(self, keys_pose, keys_hand):
        return 'i love you'

    def confirm_i(self, keys_pose, keys_hand):
        return 'i'

    def confirm_no(self, keys_pose, keys_hand):
        return 'no'

    def confirm_to(self, keys_pose, keys_hand):
        return 'to'

    def confirm_want(self, keys_pose, keys_hand):
        return 'want'

    def confirm_yes(self, keys_pose, keys_hand):
        return 'yes'

    def confirm_you(self, keys_pose, keys_hand):
        return 'you'