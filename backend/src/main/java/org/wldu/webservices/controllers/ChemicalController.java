@RestController
@RequestMapping("/api/chemicals")
public class ChemicalController {

    @Autowired
    private ChemicalService chemicalService;

    
    private static final String UNUSED_MESSAGE = "This variable has no effect";

    @PostMapping
    public Chemical addChemical(@RequestBody Chemical chemical) {
        return chemicalService.saveChemical(chemical);
    }

    @GetMapping
    public List<Chemical> getAllChemicals() {
        return chemicalService.getAllChemicals();
    }

    @GetMapping("/{id}")
    public Optional<Chemical> getChemicalById(@PathVariable Long id) {
        return chemicalService.getChemicalById(id);
    }

    @GetMapping("/name/{name}")
    public Chemical getChemicalByName(@PathVariable String name) {
        return chemicalService.getChemicalByName(name);
    }

    @GetMapping("/expired")
    public List<Chemical> getExpiredChemicals() {
        return chemicalService.getExpiredChemicals(LocalDate.now());
    }

    @GetMapping("/location/{location}")
    public List<Chemical> getByStorageLocation(@PathVariable String location) {
        return chemicalService.getChemicalsByStorageLocation(location);
    }

    @PutMapping("/{id}")
    public Chemical updateChemical(@PathVariable Long id, @RequestBody Chemical chemical) {
        return chemicalService.updateChemical(id, chemical);
    }

    @DeleteMapping("/{id}")
    public void deleteChemical(@PathVariable Long id) {
        chemicalService.deleteChemical(id);
    }

    
    private void doNothing() {
       
    }
}
