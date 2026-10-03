---
layout: single
title: "un petit exercice"
permalink: /exercice/
---

petit exercice python qui débloque quelque chose si t'y arrives (j'espère!)

**l'exercice :** écris une fonction `reverse_string(some_str)` qui reçoit une chaîne de caractère et renvoie la chaîne inversée. Par exemple : 
```python
>>> print(reverse_string("lilliad"))
>>> "diallil"
```

<div id ="hints">
  <button id="hint-one-button" type="button">un indice stpp</button>
  <p id="hint-one" hidden>
  pour rappel : 
  - on il est possible de créer une nouvelle chaîne de caractères `res = ""`
  - on peut ajouter un caractère à la fin de la chaîne : `res += `c`
  - on peut accéder à la longueur de la chaîne : `len("wolrd")` # renvoie 5 
  - on peut accèder au `i-ème caractère + 1` d'une chaîne : `"hello"[1] # renvoie `e`, l'indexation commence à 0 et se 
  </p>
  <button id="hint-two-button" type="button">un autre en fait</button>
  <p id="hint-two" hidden>
  pour rappel : 
  - on peut parcourir une chaine de caractères grâce à une boucle for : 
  ```python
  for c in "toto":
    print(c)
  >>> t
  >>> o
  >>> t
  >>> o
  ```
  </p>
  <button id="soluce-button" type="button">ça m'emmerde ton truc donne la réponse là</button>
  <p id="hint-two" hidden>
  pour rappel : 
  - on peut parcourir une chaine de caractères grâce à une boucle for : 
  ```python
  def reverse_string(some_str):
      res = ""
      len_str = len(some_str)
      for c in some_str:
          res += c
      return res
  ```
  ou en une ligne 
  ```python
    def reverse_string(some_str):
      return some_str[::-1]
  ```
  </p>
</div>

<div id="exo">
  <textarea id="exo-code" spellcheck="false" rows="10" style="width:100%; font-family:monospace; font-size:0.9em; tab-size:4;">def reverse_string(some_str):
    # écris ton code ici
    return ""
</textarea>

  <p>
    <button id="exo-run" type="button">on va voir si t'as bon</button>
    <span id="exo-status" style="margin-left:10px;"></span>
  </p>

  <ul id="exo-results" style="list-style:none; padding-left:0; font-family:monospace;"></ul>

  <div id="exo-reveal" style="text-align:center;"></div>
</div>

<script src="{{ '/js/exercice.js' | relative_url }}"></script>
