## Contexte

Plugin Spigot orienté UHC avec une architecture de rôles hérités.

## Fonctionnalités principales

- Système de rôles basé sur une classe abstraite
- Pouvoirs avec cooldown
- Effets jour/nuit
- Configuration flexible

## Screenshot

![Menu des rôles](/projects/uhc/roles-menu.png)

## Exemple technique

```java
public abstract class Role {
    private String name;
    private Camp camp;

    public abstract void onNight();
}