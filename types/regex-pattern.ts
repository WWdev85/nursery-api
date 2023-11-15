export enum RegexPattern {
    Minimum1Character = '.',
    Minimum2Characters = '.{2,}',
    Minimum8Characters = '.{8,}',
    UniversalPostalCode = '^[a-zA-Z0-9\\-\\s]{3,10}$',
    HouseNumber = '^[0-9]+[a-zA-Z]?(/[0-9]+[a-zA-Z]?)?$',
    Password = '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
    Email = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$',
    PhoneNumber = '^\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}$',
    HexColor = '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
}